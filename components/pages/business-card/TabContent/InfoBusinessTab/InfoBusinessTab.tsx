"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { HourglassIcon, MapPinIcon, UtensilsIcon, VideoIcon } from 'lucide-react'
import OpenHoursEditor, { DEFAULT_HOURS, OpenHoursBadge } from './OpenHours/OpenHoursEditor'
import { Button } from '@/components/ui/button'
import MenuSection from './MenuSection/MenuSection'


function InfoBusinessTab() {

    const formData = {
        openingHours: DEFAULT_HOURS,
        menu_url: "",

    }

    const sections = [
        {
            title: "Opening Hours",
            icon: <HourglassIcon className="w-5 h-5 text-muted-foreground" />,
            action: <OpenHoursBadge hours={formData.openingHours} />,
            content: (
                <OpenHoursEditor
                    initialHours={formData.openingHours}
                    onChange={(hours) => formData.openingHours = hours}
                />
            ),
        },
        {
            title: "Menu",
            icon: <UtensilsIcon className="w-5 h-5 text-muted-foreground" />,
            description: "Add Your Menu (Link, PDF, Image)",
            action: null,
            content: <MenuSection />,
        },
        {
            title: "Locations",
            icon: <MapPinIcon className="w-5 h-5 text-muted-foreground" />,
            description: "Find us at our nearest branch",
            action: null,
            content: "Coming soon",
        },
        {
            title: "Video",
            icon: <VideoIcon className="w-5 h-5 text-muted-foreground" />,
            description: "Watch our story and highlights",
            action: null,
            content: "Coming soon",
        },
    ]

    return (
        <div className='space-y-6'>

            <ScrollArea className="h-full w-full">
                <div className="space-y-4 pr-4">
                    {sections.map((section, index) => (
                        <Card key={index}>
                            <CardHeader className=" flex justify-between items-center flex-row">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-base">
                                        {section.icon}
                                        {section.title}
                                    </CardTitle>
                                    {section.description && <CardDescription>{section.description}</CardDescription>}
                                </div>
                                {section.action}
                            </CardHeader>
                            <CardContent>{section.content}</CardContent>
                        </Card>
                    ))}
                </div>
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <Button>Save</Button>
        </div>
    )
}

export default InfoBusinessTab