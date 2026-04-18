"use client"
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { OpeningHours, DayHours, DEFAULT_HOURS } from '@/lib/Schema/InfoBusiness'
import { Clock3Icon } from 'lucide-react'

// ── Constants ──────────────────────────────────────────────────────────────

const DAYS: DayHours['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

const DAY_SHORT: Record<DayHours['day'], string> = {
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
    Sunday: 'Sun',
}

// ── Helpers ────────────────────────────────────────────────────────────────

function parseMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}

function isCurrentlyOpen(open: string, close: string, currentMinutes: number): boolean {
    const openMin = parseMinutes(open)
    let closeMin = parseMinutes(close)
    if (closeMin <= openMin) closeMin += 1440
    return (
        (currentMinutes >= openMin && currentMinutes < closeMin) ||
        (currentMinutes + 1440 >= openMin && currentMinutes + 1440 < closeMin)
    )
}

export function getStatus(hours: OpeningHours): { isOpen: boolean; sublabel: string } {
    const now = new Date()
    const currentDay = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1]
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const today = hours.find(d => d.day === currentDay)

    if (!today || today.closed || !today.open || !today.close) {
        return { isOpen: false, sublabel: 'Closed today' }
    }
    if (today.open24h) {
        return { isOpen: true, sublabel: 'Open 24 hours' }
    }
    if (isCurrentlyOpen(today.open, today.close, currentMinutes)) {
        return { isOpen: true, sublabel: `Closes ${today.close}` }
    }
    return { isOpen: false, sublabel: `Opens ${today.open}` }
}

// ── Editor ─────────────────────────────────────────────────────────────────

interface OpenHoursEditorProps {
    initialHours?: OpeningHours
    onChange?: (hours: OpeningHours) => void
}

function OpenHoursEditor({ initialHours = DEFAULT_HOURS, onChange }: OpenHoursEditorProps) {
    const [hours, setHours] = useState<OpeningHours>(
        DAYS.map(day => initialHours.find(d => d.day === day) ?? { day, closed: true, open24h: false })
    )
    const [timeErrors, setTimeErrors] = useState<Record<string, string>>({})

    function update(day: DayHours['day'], patch: Partial<DayHours>) {
        const next = hours.map(d => d.day === day ? { ...d, ...patch } : d)
        const updated = next.find(d => d.day === day)!

        if (!updated.closed && !updated.open24h && updated.open && updated.close) {
            const openMin = parseMinutes(updated.open)
            const closeMin = parseMinutes(updated.close)
            if (openMin === closeMin) {
                setTimeErrors(prev => ({ ...prev, [day]: 'Opening and closing time cannot be the same' }))
                setHours(next)
                return
            }
        }

        setTimeErrors(prev => { const e = { ...prev }; delete e[day]; return e })
        setHours(next)
        onChange?.(next)
    }

    function toggleDay(day: DayHours['day'], checked: boolean) {
        if (checked) {
            update(day, { closed: false, open24h: false, open: '09:00', close: '18:00' })
        } else {
            setTimeErrors(prev => { const e = { ...prev }; delete e[day]; return e })
            update(day, { closed: true, open24h: false, open: undefined, close: undefined })
        }
    }

    function toggle24h(day: DayHours['day'], checked: boolean) {
        setTimeErrors(prev => { const e = { ...prev }; delete e[day]; return e })
        update(day, {
            open24h: checked,
            open: checked ? '00:00' : '09:00',
            close: checked ? '23:59' : '18:00',
        })
    }

    return (
        <div className="space-y-2">
            {hours.map(({ day, closed, open, close, open24h }) => {
                const isOpen = !closed
                const is24h = !!open24h

                return (
                    <div
                        key={day}
                        className={[
                            "group relative  rounded-lg px-3  py-3 transition-all duration-200",
                            isOpen
                                ? "bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40"
                                : "bg-muted/30 border border-transparent",
                        ].join(" ")}
                    >
                        {/* Open accent bar */}
                        {isOpen && (
                            <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-emerald-500" />
                        )}

                        {/* ── Row layout ── */}
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            {/* Left: day name + open toggle */}
                            <div className="flex items-center justify-between sm:justify-start sm:gap-3 min-w-0">
                                <span className={[
                                    "text-sm font-semibold w-24 shrink-0 transition-colors duration-200",
                                    isOpen ? "text-foreground" : "text-muted-foreground",
                                ].join(" ")}>
                                    {/* Full name on sm+, short on mobile */}
                                    <span className="hidden sm:inline">{day}</span>
                                    <span className="sm:hidden">{DAY_SHORT[day]}</span>
                                </span>

                                {/* Open / Closed switch */}
                                <div className="flex items-center gap-2 sm:hidden">
                                    <Switch
                                        checked={isOpen}
                                        onCheckedChange={checked => toggleDay(day, checked)}
                                        className="data-[state=checked]:bg-emerald-500 shrink-0"
                                    />
                                    <span className={[
                                        "text-xs font-medium w-12",
                                        isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                    ].join(" ")}>
                                        {isOpen ? "Open" : "Closed"}
                                    </span>
                                </div>
                            </div>

                            {/* Right: all controls */}
                            <div className="flex items-center gap-3 flex-wrap">

                                {/* Open/Closed switch — desktop only */}
                                <div className="hidden sm:flex items-center gap-2">
                                    <Switch
                                        checked={isOpen}
                                        onCheckedChange={checked => toggleDay(day, checked)}
                                        className="data-[state=checked]:bg-emerald-500 shrink-0"
                                    />
                                    <span className={[
                                        "text-xs font-medium w-12",
                                        isOpen ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                    ].join(" ")}>
                                        {isOpen ? "Open" : "Closed"}
                                    </span>
                                </div>

                                {/* Time controls — only when open */}
                                {isOpen && (
                                    <>
                                        {/* Divider — desktop */}
                                        <span className="hidden sm:block h-4 w-px bg-border/60" />

                                        {/* 24h toggle */}
                                        <div className="flex items-center gap-1.5">
                                            <Switch
                                                id={`24h-${day}`}
                                                checked={is24h}
                                                onCheckedChange={checked => toggle24h(day, checked)}
                                                className="data-[state=checked]:bg-sky-500"
                                            />
                                            <Label
                                                htmlFor={`24h-${day}`}
                                                className="text-xs text-muted-foreground cursor-pointer select-none whitespace-nowrap"
                                            >
                                                24h
                                            </Label>
                                        </div>

                                        {/* Time inputs or 24h label */}
                                        {is24h ? (
                                            <span className="flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 whitespace-nowrap">
                                                <Clock3Icon className="w-3.5 h-3.5" />
                                                Open all day
                                            </span>
                                        ) : (
                                            <div className="flex flex-col gap-1 ">
                                                <div className="flex items-center  justify-between gap-1.5">
                                                    <Input
                                                        type="time"
                                                        value={open ?? '09:00'}
                                                        onChange={e => update(day, { open: e.target.value })}
                                                        className={[
                                                            "h-8 w-[110px] text-sm tabular-nums px-2",
                                                            timeErrors[day] ? "border-destructive focus-visible:ring-destructive" : ""
                                                        ].join(" ")}
                                                    />
                                                    <span className="text-muted-foreground text-sm shrink-0 select-none">–</span>
                                                    <Input
                                                        type="time"
                                                        value={close ?? '18:00'}
                                                        onChange={e => update(day, { close: e.target.value })}
                                                        className={[
                                                            "h-8 w-[110px] text-sm tabular-nums px-2",
                                                            timeErrors[day] ? "border-destructive focus-visible:ring-destructive" : ""
                                                        ].join(" ")}
                                                    />
                                                </div>
                                                {timeErrors[day] && (
                                                    <p className="text-xs text-destructive">{timeErrors[day]}</p>
                                                )}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* Closed label */}
                                {!isOpen && (
                                    <span className="text-xs text-muted-foreground italic">No hours set</span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default OpenHoursEditor

// ── Badge ──────────────────────────────────────────────────────────────────

export function OpenHoursBadge({ hours }: { hours: OpeningHours }) {
    const status = getStatus(hours)
    return (
        <Badge
            variant="outline"
            className={[
                "flex items-center justify-center w-fit gap-1.5 text-xs px-2.5 py-1 rounded-full border",
                status.isOpen
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
                    : "border-muted bg-muted/50 text-muted-foreground"
            ].join(" ")}
        >
            <span className="relative flex h-2 w-2">
                <span className={[
                    "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                    status.isOpen ? "bg-emerald-500" : "bg-red-500"
                ].join(" ")} />
                <span className={[
                    "relative inline-flex h-2 w-2 rounded-full",
                    status.isOpen ? "bg-emerald-500" : "bg-red-500"
                ].join(" ")} />
            </span>
            {status.isOpen ? "Open now" : "Closed"}
            {status.sublabel && (
                <span className="font-normal opacity-70">{status.sublabel}</span>
            )}
        </Badge>
    )
}