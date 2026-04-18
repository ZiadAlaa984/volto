"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info } from "lucide-react"
import { useMediaQuery } from "@/hooks/useMediaQuery"

// ─── Shared hint content ──────────────────────────────────────────────────────

function MapsHint() {
    return (
        <div className="text-sm leading-relaxed space-y-1">
            <p>📍 Open Google Maps</p>
            <p>🔎 Search your place</p>
            <p>🔗 Click &quot;Share&quot; → Copy link</p>
            <p>📋 Paste it here</p>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MapsLabel() {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    return (
        <Label htmlFor="maps-url" className="flex items-center gap-2">
            Google Maps link

            {isDesktop ? (
                // ── Desktop: hover tooltip ────────────────────────────────
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            type="button"
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            <Info size={16} />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[260px]">
                        <MapsHint />
                    </TooltipContent>
                </Tooltip>
            ) : (
                // ── Mobile: tap popover ───────────────────────────────────
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="text-muted-foreground hover:text-primary transition-colors"
                            aria-label="How to get a Google Maps link"
                        >
                            <Info size={16} />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="top"
                        align="start"
                        className="w-[240px] p-3"
                    >
                        <MapsHint />
                    </PopoverContent>
                </Popover>
            )}
        </Label>
    )
}