"use client"
import { Control, useFieldArray, useWatch, useFormContext } from "react-hook-form"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { InfoFormValues, MenuItemValue, DEFAULT_MENU_ITEM } from "@/lib/Schema/InfoBusiness"
import FileUpload from "@/components/shared/FileUpload"
import { PlusIcon, Trash2Icon } from "lucide-react"

interface MenuSectionProps {
    control: Control<InfoFormValues>
}

function MenuSection({ control }: MenuSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "menu",
    })

    return (
        <div className="space-y-4">
            {fields.map((field, index) => (
                <MenuRow
                    key={field.id}
                    index={index}
                    control={control}
                    onRemove={() => remove(index)}
                />
            ))}

            {fields.length < 3 && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={() => append({ ...DEFAULT_MENU_ITEM })}
                >
                    <PlusIcon className="w-4 h-4" />
                    Add menu
                    {fields.length > 0 && (
                        <span className="text-muted-foreground">({fields.length}/3)</span>
                    )}
                </Button>
            )}

            {fields.length === 0 && (
                <p className="text-xs text-center text-muted-foreground py-2">
                    No menus added yet.
                </p>
            )}
        </div>
    )
}

// ─── Single menu row ──────────────────────────────────────────────────────────

interface MenuRowProps {
    index: number
    control: Control<InfoFormValues>
    onRemove: () => void
}

function MenuRow({ index, control, onRemove }: MenuRowProps) {
    const { setValue } = useFormContext<InfoFormValues>()
    const activeTab = useWatch({ control, name: `menu.${index}.activeTab` })

    return (
        <div className="relative rounded-lg border border-border p-4 space-y-3">

            {/* ── Remove ── */}
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove menu"
            >
                <Trash2Icon className="w-4 h-4" />
            </button>

            <p className="text-sm font-medium">Menu {index + 1}</p>

            {/* ── Label / Name ── */}
            <FormField
                control={control}
                name={`menu.${index}.label`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs text-muted-foreground">
                            Name <span className="opacity-50">(optional)</span>
                        </FormLabel>
                        <FormControl>
                            <Input
                                placeholder="e.g. Restaurant Menu, Cafe Menu, Drinks…"
                                maxLength={40}
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* ── Per-row Upload / Link tabs ── */}
            <Tabs
                value={activeTab}
                onValueChange={val =>
                    setValue(
                        `menu.${index}.activeTab`,
                        val as "upload" | "link",
                        { shouldDirty: true }
                    )
                }
            >
                <TabsList className="w-full">
                    <TabsTrigger value="upload" className="flex-1">Upload</TabsTrigger>
                    <TabsTrigger value="link" className="flex-1">Link</TabsTrigger>
                </TabsList>

                {/* Upload */}
                <TabsContent value="upload" className="pt-2">
                    <FormField
                        control={control}
                        name={`menu.${index}.content`}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="mb-2 block">Menu file</FormLabel>
                                <FileUpload
                                    accept="image/*,application/pdf"
                                    maxSizeMB={20}
                                    value={field.value instanceof File ? field.value : null}
                                    savedUrl={
                                        field.value &&
                                            !(field.value instanceof File) &&
                                            field.value.type === "file"
                                            ? field.value.value
                                            : undefined
                                    }
                                    onChange={file => field.onChange(file ?? null)}
                                    error={fieldState.error?.message}
                                />
                            </FormItem>
                        )}
                    />
                </TabsContent>

                {/* Link */}
                <TabsContent value="link" className="space-y-2 pt-2">
                    <FormField
                        control={control}
                        name={`menu.${index}.content`}
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel>Menu URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://your-menu-link.com"
                                        value={
                                            field.value &&
                                                !(field.value instanceof File) &&
                                                field.value.type === "text"
                                                ? field.value.value
                                                : ""
                                        }
                                        onChange={e =>
                                            field.onChange({
                                                type: "text",
                                                value: e.target.value,
                                            })
                                        }
                                    />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    Paste a link — website, Zomato, Talabat, Google Drive, etc.
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default MenuSection