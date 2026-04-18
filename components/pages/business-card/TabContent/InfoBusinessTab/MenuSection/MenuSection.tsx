"use client"

import { Control, useFieldArray } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InfoFormValues, MenuItemValue, DEFAULT_MENU_ITEM } from "@/lib/Schema/InfoBusiness"
import FileUpload from "@/components/shared/FileUpload"
import { LinkIcon, PlusIcon, UtensilsIcon, XIcon } from "lucide-react"
import { useState } from "react"

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_MENUS = 3

// ─── Types ────────────────────────────────────────────────────────────────────

export type MenuTabValue = "upload" | "link"

interface MenuSectionProps {
    control: Control<InfoFormValues>
    activeTab: MenuTabValue
}

// ─── Menu Card ────────────────────────────────────────────────────────────────

interface MenuCardProps {
    item: MenuItemValue
    index: number
    onDelete: () => void
}

function MenuCard({ item, index, onDelete }: MenuCardProps) {
    const isFile =
        item.content instanceof File ||
        (item.content && !(item.content instanceof File) && item.content.type === "file")

    const displayName = (() => {
        if (item.content instanceof File) return item.content.name
        if (item.content && !(item.content instanceof File) && item.content.type === "file") {
            // Extract filename from URL
            const url = item.content.value
            return url.split("/").pop()?.split("?")[0] ?? url
        }
        if (item.content && !(item.content instanceof File) && item.content.type === "text") {
            return item.content.value
        }
        return null
    })()

    const href = (() => {
        if (item.content instanceof File) return URL.createObjectURL(item.content)
        if (item.content && !(item.content instanceof File)) return item.content.value
        return null
    })()

    return (
        <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                    <UtensilsIcon className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                    <div className="space-y-0.5">
                        {item.label && (
                            <p className="text-sm font-medium">{item.label}</p>
                        )}
                        {displayName && href && (
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline break-all"
                            >
                                {isFile ? `📄 ${displayName}` : displayName} ↗
                            </a>
                        )}
                        {!displayName && !item.label && (
                            <p className="text-xs text-muted-foreground">Menu {index + 1}</p>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Remove menu"
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// ─── Upload Form ──────────────────────────────────────────────────────────────

interface UploadFormProps {
    onAdd: (item: MenuItemValue) => void
}

function UploadForm({ onAdd }: UploadFormProps) {
    const [label, setLabel] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | undefined>()

    function handleAdd() {
        if (!file) return
        onAdd({
            ...DEFAULT_MENU_ITEM,
            label: label.trim(),
            content: file,
            activeTab: "upload",
        })
        setLabel("")
        setFile(null)
        setError(undefined)
    }

    return (
        <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
                <Label htmlFor="menu-upload-label">
                    Name{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                    id="menu-upload-label"
                    placeholder="e.g. Restaurant Menu, Cafe Menu, Drinks…"
                    maxLength={40}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label>Menu file</Label>
                <FileUpload
                    accept="image/*,application/pdf"
                    maxSizeMB={20}
                    value={file}
                    onChange={(f) => {
                        setFile(f ?? null)
                        setError(undefined)
                    }}
                    error={error}
                />
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={!file}
                onClick={handleAdd}
            >
                <PlusIcon className="w-4 h-4" />
                Add menu
            </Button>
        </div>
    )
}

// ─── Link Form ────────────────────────────────────────────────────────────────

interface LinkFormProps {
    onAdd: (item: MenuItemValue) => void
}

function LinkForm({ onAdd }: LinkFormProps) {
    const [label, setLabel] = useState("")
    const [url, setUrl] = useState("")

    function handleAdd() {
        if (!url.trim()) return
        onAdd({
            ...DEFAULT_MENU_ITEM,
            label: label.trim(),
            content: { type: "text", value: url.trim() },
            activeTab: "link",
        })
        setLabel("")
        setUrl("")
    }

    return (
        <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
                <Label htmlFor="menu-link-label">
                    Name{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                    id="menu-link-label"
                    placeholder="e.g. Restaurant Menu, Cafe Menu, Drinks…"
                    maxLength={40}
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="menu-link-url">Menu URL</Label>
                <Input
                    id="menu-link-url"
                    type="url"
                    placeholder="https://your-menu-link.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                    Paste a link — website, Zomato, Talabat, Google Drive, etc.
                </p>
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={!url.trim()}
                onClick={handleAdd}
            >
                <LinkIcon className="w-4 h-4" />
                Add menu
            </Button>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

function MenuSection({ control, activeTab }: MenuSectionProps) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "menu",
    })

    const canAdd = fields.length < MAX_MENUS

    function handleAdd(item: MenuItemValue) {
        append(item)
    }

    return (
        <div className="space-y-4">
            {/* Form — driven by activeTab from FloatingTabs in the card header */}
            {canAdd ? (
                activeTab === "upload" ? (
                    <UploadForm onAdd={handleAdd} />
                ) : (
                    <LinkForm onAdd={handleAdd} />
                )
            ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                    Maximum {MAX_MENUS} menus reached.
                </p>
            )}

            {/* Saved menus list */}
            {fields.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        {fields.length} menu{fields.length > 1 ? "s" : ""}
                    </Label>
                    {fields.map((field, index) => (
                        <MenuCard
                            key={field.id}
                            item={field as unknown as MenuItemValue}
                            index={index}
                            onDelete={() => remove(index)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default MenuSection