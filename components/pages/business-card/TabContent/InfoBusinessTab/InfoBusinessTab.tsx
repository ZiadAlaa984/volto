"use client"
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { HourglassIcon, MapPinIcon, UtensilsIcon, VideoIcon } from 'lucide-react'
import OpenHoursEditor, { OpenHoursBadge } from './OpenHours/OpenHoursEditor'
import MenuSection from './MenuSection/MenuSection'
import VideoSection from './VideoSection/VideoSection'
import LocationSection from './LocationSection/LocationSection'
import { DEFAULT_HOURS, formSchema, InfoFormValues } from '@/lib/Schema/InfoBusiness'
import useBusinessInfo from '@/hooks/useBusinessInfo'
import Loading from '@/app/loading'

function InfoBusinessTab({ card_id }: { card_id: string | undefined }) {
    const router = useRouter()
    const { businessData, isLoading, updateBusiness, isPending } = useBusinessInfo(card_id || "")

    // ─── Form ─────────────────────────────────────────────────────────────

    const form = useForm<InfoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            opening_hours: DEFAULT_HOURS,
            locations: [],
            menu: null,
            video_url: '',
        },
        // sync form when businessData loads from API
        values: {
            opening_hours: businessData?.opening_hours ?? DEFAULT_HOURS,
            locations: businessData?.locations ?? [],
            menu: (typeof businessData?.menu === 'string') ? businessData.menu : null,         // string URL from DB or null
            video_url: businessData?.video_url ?? '',
        },
    })

    // ─── Submit ───────────────────────────────────────────────────────────

    async function onSubmit(values: InfoFormValues) {
        if (!businessData?.id) return

        await updateBusiness({
            id: businessData.id,
            data: {
                opening_hours: values.opening_hours,
                locations: values.locations,
                menu: values.menu as any,               // string | File | null
                video_url: values.video_url || null,
            },
            currentMenu: businessData.menu,      // existing URL so hook can delete if replaced
        })
    }

    // ─── Sections ─────────────────────────────────────────────────────────

    const sections = [
        {
            title: 'Opening Hours',
            icon: <HourglassIcon className="w-5 h-5 text-muted-foreground" />,
            action: <OpenHoursBadge hours={form.watch('opening_hours')} />,
            content: (
                <Controller
                    control={form.control}
                    name="opening_hours"
                    render={({ field }) => (
                        <OpenHoursEditor
                            initialHours={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            ),
        },
        {
            title: 'Menu',
            icon: <UtensilsIcon className="w-5 h-5 text-muted-foreground" />,
            action: null,
            content: <MenuSection control={form.control} />,
        },
        {
            title: 'Video',
            icon: <VideoIcon className="w-5 h-5 text-muted-foreground" />,
            action: null,
            content: <VideoSection control={form.control} />,
        },
        {
            title: 'Locations',
            icon: <MapPinIcon className="w-5 h-5 text-muted-foreground" />,
            action: null,
            content: (
                <Controller
                    control={form.control}
                    name="locations"
                    render={({ field }) => (
                        <LocationSection
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                />
            ),
        },
    ]

    if (isLoading) return <Loading />

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="h-[calc(100vh-200px)] w-full">
                    <div className="space-y-4 pb-6">
                        {sections.map((section, index) => (
                            <Card key={index}>
                                <CardHeader className="flex justify-between items-center flex-row">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                            {section.icon}
                                            {section.title}
                                        </CardTitle>
                                    </div>
                                    {section.action}
                                </CardHeader>
                                <CardContent>{section.content}</CardContent>
                            </Card>
                        ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>

                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </form>
        </Form>
    )
}

export default InfoBusinessTab