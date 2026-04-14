"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingTabs } from "@/components/floating-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { HourglassIcon, MapPinIcon, UtensilsIcon, VideoIcon } from "lucide-react";
import OpenHoursEditor, { OpenHoursBadge } from "./OpenHours/OpenHoursEditor";
import MenuSection from "./MenuSection/MenuSection";
import VideoSection from "./VideoSection/VideoSection";
import { DEFAULT_HOURS, formSchema, InfoFormValues } from "@/lib/Schema/InfoBusiness";
import Loading from "@/app/loading";
import { BusinessType } from "@/types/business";
import { LocationSection } from "./LocationSection/LocationSection";


// todo Menu, RLS business card, responsive
// todo Card design

// ─── Types ────────────────────────────────────────────────────────────────────

interface InfoBusinessTabProps {
    updateBusiness: (params: {
        id: string;
        data: Partial<BusinessType> & { menu?: any };
        currentMenu?: string | null;
    }) => Promise<void>;
    businessData: BusinessType;
    isPending: boolean;
    isLoading: boolean;
}

// ─── Location tab config ──────────────────────────────────────────────────────

const LOCATION_TABS: { value: "address" | "google-map"; label: string }[] = [
    { value: "address", label: "Address" },
    { value: "google-map", label: "Google Map" },
];

// ─── Section card ─────────────────────────────────────────────────────────────

interface SectionConfig {
    title: string;
    icon: React.ReactNode;
    action?: React.ReactNode;
    content: React.ReactNode;
}

function SectionCard({ title, icon, action, content }: SectionConfig) {
    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                    {icon}
                    {title}
                </CardTitle>
                {action && <div className="w-full md:w-auto">{action}</div>}
            </CardHeader>
            <CardContent>{content}</CardContent>
        </Card>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

function InfoBusinessTab({
    updateBusiness,
    businessData,
    isPending,
    isLoading,
}: InfoBusinessTabProps) {
    const [locationTab, setLocationTab] = useState<"address" | "google-map">("address");

    // ── Form ───────────────────────────────────────────────────────────────────

    const form = useForm<InfoFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            opening_hours: DEFAULT_HOURS,
            locations: [],
            menu: null,
            video_url: "",
        },
        // Syncs automatically when businessData arrives from the API
        values: {
            opening_hours: businessData?.opening_hours ?? DEFAULT_HOURS,
            locations: businessData?.locations ?? [],
            menu: typeof businessData?.menu === "string" ? businessData.menu : null,
            video_url: businessData?.video_url ?? "",
        },
    });

    // ── Submit ─────────────────────────────────────────────────────────────────

    async function onSubmit(values: InfoFormValues) {
        if (!businessData?.id) return;

        console.log("🚀 ~ onSubmit ~ values:", values)
        await updateBusiness({
            id: businessData.id,
            data: {
                opening_hours: values.opening_hours,
                locations: values.locations,
                menu: values.menu as any,
                video_url: values.video_url || null,
            },
            currentMenu: businessData.menu,
        });
    }

    // ── Sections config ────────────────────────────────────────────────────────

    const sections: SectionConfig[] = [
        {
            title: "Opening Hours",
            icon: <HourglassIcon className="w-5 h-5 text-muted-foreground" />,
            action: <OpenHoursBadge hours={form.watch("opening_hours")} />,
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
            title: "Video",
            icon: <VideoIcon className="w-5 h-5 text-muted-foreground" />,
            content: <VideoSection control={form.control} />,
        },
        {
            title: "Locations",
            icon: <MapPinIcon className="w-5 h-5 text-muted-foreground" />,
            // FloatingTabs in the header drives the form inside LocationSection
            action: (
                <FloatingTabs<"address" | "google-map">
                    tabs={LOCATION_TABS}
                    defaultValue="address"
                    onChange={setLocationTab}
                />
            ),
            content: (
                <Controller
                    control={form.control}
                    name="locations"
                    render={({ field }) => (
                        <LocationSection
                            value={field.value}
                            onChange={field.onChange}
                            activeTab={locationTab}
                        />
                    )}
                />
            ),
        },
        {
            title: "Menu",
            icon: <UtensilsIcon className="w-5 h-5 text-muted-foreground" />,
            content: <MenuSection control={form.control} />,
        },
    ];

    // ── Render ─────────────────────────────────────────────────────────────────

    if (isLoading) return <Loading />;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <ScrollArea className="h-[calc(100vh-200px)] w-full">
                    <div className="space-y-4 pb-6">
                        {sections.map((section) => (
                            <SectionCard key={section.title} {...section} />
                        ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                </ScrollArea>

                <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isPending || !form.formState.isDirty}
                >
                    {isPending ? "Saving…" : "Save"}
                </Button>
            </form>
        </Form>
    );
}

export default InfoBusinessTab;