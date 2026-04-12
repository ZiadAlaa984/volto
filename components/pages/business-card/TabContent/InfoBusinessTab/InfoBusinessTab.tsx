"use client"
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { HourglassIcon, MapPinIcon, UtensilsIcon, VideoIcon } from 'lucide-react'
import OpenHoursEditor, { DEFAULT_HOURS, OpenHoursBadge } from './OpenHours/OpenHoursEditor'
import MenuSection from './MenuSection/MenuSection'
import VideoSection from './VideoSection/VideoSection'
import LocationSection from './LocationSection/LocationSection'

// ── Schemas ────────────────────────────────────────────────────────────────

export const dayHoursSchema = z.object({
    day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    closed: z.boolean(),
    open: z.string().optional(),
    close: z.string().optional(),
})

export const openingHoursSchema = z.array(dayHoursSchema)

export const locationSchema = z.object({
    id: z.string(),
    type: z.enum(['text', 'maps']),
    title: z.string(),
    address: z.string().optional(),
    maps_url: z.string().optional(),
})

const formSchema = z.object({
    openingHours: openingHoursSchema,
    locations: z.array(locationSchema).max(3),
    menu_url: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')),
    video_url: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')),
})

// ── Types ──────────────────────────────────────────────────────────────────

export type DayHours = z.infer<typeof dayHoursSchema>
export type OpeningHours = z.infer<typeof openingHoursSchema>
export type Location = z.infer<typeof locationSchema>
export type InfoFormValues = z.infer<typeof formSchema>

// ── Component ──────────────────────────────────────────────────────────────

function InfoBusinessTab() {
    const form = useForm<InfoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            openingHours: DEFAULT_HOURS,
            locations: [],
            menu_url: '',
            video_url: '',
        },
    })

    function onSubmit(values: InfoFormValues) {
        // TODO: send values to your API / server action
        console.log('Submit:', values)
    }

    const sections = [
        {
            title: 'Opening Hours',
            icon: <HourglassIcon className="w-5 h-5 text-muted-foreground" />,
            action: <OpenHoursBadge hours={form.watch('openingHours')} />,
            content: (
                <Controller
                    control={form.control}
                    name="openingHours"
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
            description: 'Add your menu link',
            action: null,
            content: (
                <Controller
                    control={form.control}
                    name="menu_url"
                    render={({ field, fieldState }) => (
                        <MenuSection
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            ),
        },
        {
            title: 'Video',
            icon: <VideoIcon className="w-5 h-5 text-muted-foreground" />,
            description: 'Add a video from YouTube, Vimeo, Instagram or TikTok',
            action: null,
            content: (
                <Controller
                    control={form.control}
                    name="video_url"
                    render={({ field, fieldState }) => (
                        <VideoSection
                            value={field.value}
                            onChange={field.onChange}
                            error={fieldState.error?.message}
                        />
                    )}
                />
            ),
        },
        {
            title: 'Locations',
            icon: <MapPinIcon className="w-5 h-5 text-muted-foreground" />,
            description: 'Add up to 3 branches',
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

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-full w-full">
                <div className="space-y-4 pr-4">
                    {sections.map((section, index) => (
                        <Card key={index}>
                            <CardHeader className="flex justify-between items-center flex-row">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        {section.icon}
                                        {section.title}
                                    </CardTitle>
                                    {section.description && (
                                        <CardDescription>{section.description}</CardDescription>
                                    )}
                                </div>
                                {section.action}
                            </CardHeader>
                            <CardContent>{section.content}</CardContent>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>

            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
        </form>
    )
}

export default InfoBusinessTab