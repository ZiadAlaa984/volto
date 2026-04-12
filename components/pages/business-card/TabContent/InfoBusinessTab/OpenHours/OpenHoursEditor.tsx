"use client"
import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OpeningHours, DayHours } from '@/types/business'
import { Badge } from '@/components/ui/badge'

const DAYS: DayHours['day'][] = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
]

export const DEFAULT_HOURS: OpeningHours = [
    { day: 'Monday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Tuesday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Wednesday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Thursday', closed: false, open: '09:00', close: '18:00' },
    { day: 'Friday', closed: false, open: '09:00', close: '17:00' },
    { day: 'Saturday', closed: true },
    { day: 'Sunday', closed: true },
]

function parseMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number)
    return h * 60 + m
}

export function getStatus(hours: OpeningHours): { isOpen: boolean; sublabel: string } {
    const now = new Date()
    const currentDay = DAYS[now.getDay() === 0 ? 6 : now.getDay() - 1]
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const today = hours.find(d => d.day === currentDay)

    if (!today || today.closed || !today.open || !today.close) {
        return { isOpen: false, sublabel: 'Closed today' }
    }

    const openMin = parseMinutes(today.open)
    const closeMin = parseMinutes(today.close)

    if (currentMinutes >= openMin && currentMinutes < closeMin) {
        return { isOpen: true, sublabel: `Closes ${today.close}` }
    }

    return { isOpen: false, sublabel: `Opens ${today.open}` }
}

interface OpenHoursEditorProps {
    initialHours?: OpeningHours
    onChange?: (hours: OpeningHours) => void
}

function OpenHoursEditor({ initialHours = DEFAULT_HOURS, onChange }: OpenHoursEditorProps) {
    const [hours, setHours] = useState<OpeningHours>(
        DAYS.map(day => initialHours.find(d => d.day === day) ?? { day, closed: true })
    )

    function update(day: DayHours['day'], patch: Partial<DayHours>) {
        const next = hours.map(d => d.day === day ? { ...d, ...patch } : d)
        setHours(next)
        onChange?.(next)
    }

    function toggleDay(day: DayHours['day'], checked: boolean) {
        if (checked) {
            update(day, { closed: false, open: '09:00', close: '18:00' })
        } else {
            update(day, { closed: true, open: undefined, close: undefined })
        }
    }

    return (
        <div className="space-y-2">
            {hours.map(({ day, closed, open, close }) => (
                <div
                    key={day}
                    className="flex  justify-between  flex-col md:flex-row gap-3 py-2.5 border-b border-border/50 last:border-0"
                >
                    <div className="flex items-center justify-between  gap-4">
                        <Label className="w-24 shrink-0 text-md font-medium">{day}</Label>
                        <Switch
                            checked={!closed}
                            onCheckedChange={(checked) => toggleDay(day, checked)}
                            className="data-[state=checked]:bg-emerald-500 shrink-0"
                        />
                    </div>

                    <div>
                        {closed ? (
                            <span className="text-sm text-muted-foreground italic">Closed</span>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Input
                                    type="time"
                                    value={open ?? '09:00'}
                                    onChange={e => update(day, { open: e.target.value })}
                                    className="h-8 text-sm  tabular-nums"
                                />
                                <span className="text-muted-foreground text-sm shrink-0">—</span>
                                <Input
                                    type="time"
                                    value={close ?? '18:00'}
                                    onChange={e => update(day, { close: e.target.value })}
                                    className="h-8 text-sm tabular-nums"
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default OpenHoursEditor


export function OpenHoursBadge({ hours }: { hours: OpeningHours }) {
    const status = getStatus(hours)
    return (
        <Badge
            variant="outline"
            className={` items-center gap-1.5 text-xs px-2.5 py-1 rounded-full flex border `}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
            {status.isOpen ? 'Open now' : 'Closed'}
            {status.sublabel && <span className="text-xs text-muted-foreground">{status.sublabel}</span>}
        </Badge>
    )
}
