"use client"

import * as React from "react"
import Image from "next/image"
import { Review } from "@/types/business"
import { cn } from "@/lib/utils"
import { StarRating } from "@/components/shared/star-rating"
import { cairo } from "@/lib/fonts"

export interface TestimonialMarqueeProps {
    items: Review[]
    variant?: "default" | "stacked" | "dual" | "flush" | "flush-dual"
    className?: string
    speed?: number
    containerClassName?: string
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns a formatted date if value is a valid ISO/timestamp,
 * returns the raw string as-is for relative text like "2 years ago",
 * returns null if value is empty / undefined.
 */
function formatDate(value: string | null | undefined): string | null {
    if (!value || value.trim() === "") return null
    const date = new Date(value)
    if (isNaN(date.getTime())) return value   // plain text → show as-is
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

/**
 * Safely parses review_image — handles JSON array, plain URL, or null.
 */
function parseImages(raw: string | null | undefined): string[] {
    if (!raw || raw.trim() === "") return []
    try {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            return parsed.filter((u): u is string => typeof u === "string" && u.startsWith("http"))
        }
    } catch {
        if (raw.startsWith("http")) return [raw]
    }
    return []
}

function getInitials(name: string) {
    return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
}

// ── Styles ───────────────────────────────────────────────────────────────────

const MarqueeStyles = React.memo(() => (
    <style>{`
        @keyframes marquee-left {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-100%, 0, 0); }
        }
        @keyframes marquee-right {
          from { transform: translate3d(-100%, 0, 0); }
          to   { transform: translate3d(0, 0, 0); }
        }
        .animate-marquee-left  { animation: marquee-left  var(--duration) linear infinite; }
        .animate-marquee-right { animation: marquee-right var(--duration) linear infinite; }
    `}</style>
))
MarqueeStyles.displayName = "MarqueeStyles"

// ── MarqueeRow ────────────────────────────────────────────────────────────────

const MarqueeRow = React.memo(({
    children,
    direction = "left",
    speed = 80,
    className,
    pauseOnHover = true,
}: {
    children: React.ReactNode
    direction?: "left" | "right"
    speed?: number
    className?: string
    pauseOnHover?: boolean
}) => (
    <div className={cn("group flex overflow-hidden p-2 [--gap:1rem]", className)}>
        {[0, 1].map((i) => (
            <div
                key={i}
                aria-hidden={i === 1}
                className={cn(
                    "flex shrink-0 justify-start [gap:var(--gap)] min-w-full pr-[var(--gap)] will-change-transform [backface-visibility:hidden]",
                    direction === "left" ? "animate-marquee-left" : "animate-marquee-right",
                    pauseOnHover && "group-hover:[animation-play-state:paused]"
                )}
                style={{ "--duration": `${speed}s` } as React.CSSProperties}
            >
                {children}
            </div>
        ))}
    </div>
))
MarqueeRow.displayName = "MarqueeRow"

// ── TestimonialCard ───────────────────────────────────────────────────────────

const TestimonialCard = React.memo(({
    item,
    variant = "default",
}: {
    item: Review
    variant?: "default" | "flush"
}) => {
    const dateLabel = formatDate(item.created_at)
    const hasText = !!item.review_text?.trim()
    const initials = getInitials(item.customer_name)

    // deterministic color from name
    const colors = [
        "bg-violet-100 text-violet-700",
        "bg-blue-100 text-blue-700",
        "bg-emerald-100 text-emerald-700",
        "bg-amber-100 text-amber-700",
        "bg-rose-100 text-rose-700",
        "bg-cyan-100 text-cyan-700",
    ]
    const colorClass = colors[
        item.customer_name.charCodeAt(0) % colors.length
    ]

    const baseCard =
        variant === "flush"
            ? "relative group flex h-auto w-[320px] shrink-0 flex-col gap-3 border-r border-border bg-background p-5 transition-colors hover:bg-muted/40"
            : "relative group flex h-auto w-[320px] shrink-0 flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5 transform-gpu"

    return (
        <div className={baseCard}>
            {/* top row: avatar + name + date */}
            <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${colorClass}`}>
                    {initials}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className={`text-sm font-medium truncate ${cairo.className}`}>{item.customer_name}</span>
                    {dateLabel && (
                        <span className={`text-xs text-muted-foreground ${cairo.className}`}>{dateLabel}</span>
                    )}
                </div>
                {/* stars pushed to right */}
                <div className="ml-auto shrink-0">
                    <StarRating rating={item.rating} />
                </div>
            </div>

            {/* review text */}
            {hasText && (
                <p className={`text-sm leading-relaxed text-muted-foreground line-clamp-3 ${cairo.className}`}>
                    "{item.review_text}"
                </p>
            )}
        </div>
    )
})
TestimonialCard.displayName = "TestimonialCard"

// ── TestimonialMarquee ────────────────────────────────────────────────────────

export function TestimonialMarquee({
    items,
    variant = "default",
    className,
    speed = 60,
    containerClassName,
}: TestimonialMarqueeProps) {
    const cnContainer = cn(containerClassName, className)

    const itemsToDisplay = React.useMemo(() => {
        let result = [...items]
        while (result.length < 10) result = [...result, ...items]
        return result
    }, [items])

    const half = Math.ceil(itemsToDisplay.length / 2)
    const third = Math.ceil(itemsToDisplay.length / 3)

    return (
        <React.Fragment>
            <MarqueeStyles />

            {variant === "dual" ? (
                <div className={cn("flex flex-col gap-2 py-4 overflow-hidden", containerClassName)}>
                    <MarqueeRow speed={speed} direction="left">
                        {itemsToDisplay.slice(0, half).map((item, i) => <TestimonialCard key={`row1-${i}`} item={item} />)}
                    </MarqueeRow>
                    <MarqueeRow speed={speed} direction="right">
                        {itemsToDisplay.slice(half).map((item, i) => <TestimonialCard key={`row2-${i}`} item={item} />)}
                    </MarqueeRow>
                </div>

            ) : variant === "stacked" ? (
                <div className={cn("flex flex-col gap-2 py-6 overflow-hidden h-[600px] justify-center rotate-[-2deg] scale-110", containerClassName)}>
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-background via-transparent to-background pointer-events-none" />
                    <MarqueeRow speed={speed * 1.5} direction="left" className="[--gap:0.75rem]">
                        {itemsToDisplay.slice(0, third).map((item, i) => <TestimonialCard key={`s-row1-${i}`} item={item} />)}
                    </MarqueeRow>
                    <MarqueeRow speed={speed * 1.2} direction="right" className="[--gap:0.75rem]">
                        {itemsToDisplay.slice(third, third * 2).map((item, i) => <TestimonialCard key={`s-row2-${i}`} item={item} />)}
                    </MarqueeRow>
                    <MarqueeRow speed={speed * 1.5} direction="left" className="[--gap:0.75rem]">
                        {itemsToDisplay.slice(third * 2).map((item, i) => <TestimonialCard key={`s-row3-${i}`} item={item} />)}
                    </MarqueeRow>
                </div>

            ) : variant === "flush" ? (
                <div className={cn("overflow-hidden border-y border-border bg-background relative", cnContainer)}>
                    <MarqueeRow speed={speed} direction="left" className="[--gap:0rem] p-0">
                        {itemsToDisplay.map((item, i) => <TestimonialCard key={`flush-${i}`} item={item} variant="flush" />)}
                    </MarqueeRow>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent" />
                </div>

            ) : variant === "flush-dual" ? (
                <div className={cn("flex flex-col overflow-hidden border-y border-border bg-background relative", containerClassName)}>
                    <MarqueeRow speed={speed} direction="left" className="[--gap:0rem] p-0 border-b border-border">
                        {itemsToDisplay.slice(0, half).map((item, i) => <TestimonialCard key={`fd-row1-${i}`} item={item} variant="flush" />)}
                    </MarqueeRow>
                    <MarqueeRow speed={speed} direction="right" className="[--gap:0rem] p-0">
                        {itemsToDisplay.slice(half).map((item, i) => <TestimonialCard key={`fd-row2-${i}`} item={item} variant="flush" />)}
                    </MarqueeRow>
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background to-transparent z-10" />
                </div>

            ) : (
                <div className={cn(" overflow-hidden", cnContainer)}>
                    <MarqueeRow speed={speed} direction="left">
                        {itemsToDisplay.map((item, i) => <TestimonialCard key={`default-${i}`} item={item} />)}
                    </MarqueeRow>
                </div>
            )}
        </React.Fragment>
    )
}
