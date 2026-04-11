"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
    Form, FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form";
import { SOCIAL_PLATFORMS, getPlatform, LinksFormValues, SOCIAL_PLATFORMS_GROUPED } from "@/lib/social-platforms";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { fadeInUp } from "@/lib/Animation/stepVariants";

type LinksFormProps = {
    form: UseFormReturn<LinksFormValues>;
    fields: UseFieldArrayReturn<LinksFormValues, "links">["fields"];
    watchedLinks: LinksFormValues["links"];
    errors: UseFormReturn<LinksFormValues>["formState"]["errors"];
    onPlatformChange: (index: number, key: string) => void;
    onAddLink: () => void;
    onRemove: (index: number) => void;
    onSubmit: (e?: React.BaseSyntheticEvent) => void;
};

export function LinksForm({
    form,
    fields,
    watchedLinks,
    errors,
    onPlatformChange,
    onAddLink,
    onRemove,
    onSubmit,
}: LinksFormProps) {
    return (
        <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-4">
                <motion.div {...fadeInUp(0)} className="space-y-3">
                    <AnimatePresence initial={false}>
                        {fields.map((field, index) => {
                            const platform = getPlatform(watchedLinks[index]?.platform ?? "other");
                            return (
                                <motion.div
                                    key={field.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0, transition: { delay: index * 0.05 } }}
                                    exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                                    className="rounded-xl border p-3 space-y-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`links.${index}.platform`}
                                            render={({ field: f }) => (
                                                <FormItem className="flex-1">
                                                    <Select
                                                        value={f.value}
                                                        onValueChange={(val) => { f.onChange(val); onPlatformChange(index, val); }}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Select platform" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {SOCIAL_PLATFORMS_GROUPED.map((group) => (
                                                                <SelectGroup key={group.group}>
                                                                    <SelectLabel>{group.group}</SelectLabel>
                                                                    {group.platforms.map((p) => (
                                                                        <SelectItem key={p.key} value={p.key}>
                                                                            <span className="flex items-center gap-2">
                                                                                <PlatformIcon name={p.icon} className="h-4 w-4 shrink-0" />
                                                                                {p.label}
                                                                            </span>
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {fields.length > 1 && (
                                            <Button
                                                type="button" variant="ghost" size="icon"
                                                className="shrink-0 text-muted-foreground hover:text-destructive"
                                                onClick={() => onRemove(index)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`links.${index}.title`}
                                        render={({ field: f }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder={`Label (default: ${platform.label})`} {...f} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`links.${index}.url`}
                                        render={({ field: f }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder={platform.placeholder} {...f} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>

                    <Button
                        type="button" variant="outline"
                        className="w-full gap-2 rounded-xl border-dashed"
                        onClick={onAddLink}
                    >
                        <Plus className="h-4 w-4" /> Add another link
                    </Button>

                    {errors.links?.message && (
                        <p className="text-xs text-destructive">{errors.links.message}</p>
                    )}
                </motion.div>
            </form>
        </Form>
    );
}