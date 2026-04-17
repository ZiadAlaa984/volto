"use client"
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { OpeningHours, DayHours, DEFAULT_HOURS } from '@/lib/Schema/InfoBusiness'

// ── Constants ──────────────────────────────────────────────────────────────

const DAYS: DayHours['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

// ── Helpers ────────────────────────────────────────────────────────────────

function parseMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}

// ✅ overnight-aware: if close <= open, close is next day (+1440 mins)
function isCurrentlyOpen(open: string, close: string, currentMinutes: number): boolean {
    const openMin = parseMinutes(open)
    let closeMin = parseMinutes(close)

    // overnight span e.g. 20:00 → 02:00
    if (closeMin <= openMin) closeMin += 1440

    // also check if we're in the "previous day's overnight window"
    // e.g. it's 01:00, business opened yesterday at 20:00
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

    // ✅ 24h check
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

        // ✅ only validate if NOT 24h and both times exist
        if (!updated.closed && !updated.open24h && updated.open && updated.close) {
            const openMin = parseMinutes(updated.open)
            const closeMin = parseMinutes(updated.close)

            // ✅ allow overnight (close < open), only block exact equal
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

    // ✅ new: toggle 24h per day
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
            {hours.map(({ day, closed, open, close, open24h }) => (
                <div
                    key={day}
                    className="flex justify-between flex-col md:flex-row gap-2 py-2.5 border-b border-border/50 last:border-0"
                >
                    {/* Day label + open/closed toggle */}
                    <div className="flex items-center justify-between gap-4">
                        <Label className="w-24 shrink-0 text-md font-medium">{day}</Label>
                        <Switch
                            checked={!closed}
                            onCheckedChange={checked => toggleDay(day, checked)}
                            className="data-[state=checked]:bg-emerald-500 shrink-0"
                        />
                    </div>

                    {/* Time inputs or closed label */}
                    <div className="space-y-1">
                        {closed ? (
                            <span className="text-sm text-muted-foreground italic">Closed</span>
                        ) : (
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">

                                    {/* ✅ 24h switch */}
                                    <div className="flex items-center gap-1.5 mr-1">
                                        <Switch
                                            id={`24h-${day}`}
                                            checked={open24h ?? false}
                                            onCheckedChange={checked => toggle24h(day, checked)}
                                            className=" scale-90"
                                        />
                                        <Label
                                            htmlFor={`24h-${day}`}
                                            className="text-xs text-muted-foreground cursor-pointer select-none"
                                        >
                                            24h
                                        </Label>
                                    </div>

                                    {/* ✅ hide time inputs when 24h is on */}
                                    {!open24h ? (
                                        <>
                                            <Input
                                                type="time"
                                                value={open ?? '09:00'}
                                                onChange={e => update(day, { open: e.target.value })}
                                                className={`h-8 text-sm tabular-nums ${timeErrors[day] ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                            <span className="text-muted-foreground text-sm shrink-0">—</span>
                                            <Input
                                                type="time"
                                                value={close ?? '18:00'}
                                                onChange={e => update(day, { close: e.target.value })}
                                                className={`h-8 text-sm tabular-nums ${timeErrors[day] ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                            />
                                        </>
                                    ) : (
                                        // ✅ friendly label when 24h is active
                                        <span className="text-sm font-medium">
                                            Open 24 hours
                                        </span>
                                    )}
                                </div>

                                {timeErrors[day] && (
                                    <p className="text-xs text-destructive">{timeErrors[day]}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
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
            className={`flex items-center justify-center w-fit gap-1.5 text-xs px-2.5 py-1 rounded-full border ${status.isOpen
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                : 'border-muted bg-muted/50 text-muted-foreground'
                }`}
        >
            <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-muted-foreground'} opacity-75`} />
                <span className={`relative inline-flex h-2 w-2 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
            </span>
            {status.isOpen ? 'Open now' : 'Closed'}
            {status.sublabel && (
                <span className="font-normal opacity-70">{status.sublabel}</span>
            )}
        </Badge>
    )
}