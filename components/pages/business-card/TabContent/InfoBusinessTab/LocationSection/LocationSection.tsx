"use client"
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPinIcon, LinkIcon, XIcon, PlusIcon } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type LocationType = 'text' | 'maps'

export interface Location {
    id: string
    type: LocationType
    title: string           // branch name — e.g. "فرع المول" or "Downtown"
    address?: string        // text address — used when type = 'text'
    maps_url?: string       // google maps link — used when type = 'maps'
}

interface LocationSectionProps {
    value: Location[]
    onChange: (locations: Location[]) => void
}

// ── Validation ─────────────────────────────────────────────────────────────

const mapsUrlSchema = z.string().refine(
    url => {
        try {
            const u = new URL(url)
            return (
                u.hostname.includes('google.com/maps') ||
                u.hostname.includes('maps.app.goo.gl') ||
                u.hostname.includes('goo.gl')
            )
        } catch {
            return false
        }
    },
    { message: 'Please paste a valid Google Maps link' }
)

// ── Location card ──────────────────────────────────────────────────────────

function LocationCard({ location, onDelete }: { location: Location; onDelete: () => void }) {
    return (
        <div className="rounded-lg border border-border p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
                    <div className="space-y-0.5">
                        {location.title && (
                            <p className="text-sm font-medium">{location.title}</p>
                        )}
                        {location.type === 'text' && location.address && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {location.address}
                            </p>
                        )}
                        {location.type === 'maps' && location.maps_url && (
                            <a
                                href={location.maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Open in Google Maps ↗
                            </a>
                        )}
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onDelete}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// ── Main component ─────────────────────────────────────────────────────────

function LocationSection({ value, onChange }: LocationSectionProps) {
    const [tab, setTab] = useState<LocationType>('text')

    // text form state
    const [textTitle, setTextTitle] = useState('')
    const [textAddress, setTextAddress] = useState('')

    // maps form state
    const [mapsTitle, setMapsTitle] = useState('')
    const [mapsUrl, setMapsUrl] = useState('')
    const [mapsError, setMapsError] = useState('')

    const canAdd = value.length < 3

    function handleAddText() {
        if (!textAddress.trim()) return
        onChange([...value, {
            id: crypto.randomUUID(),
            type: 'text',
            title: textTitle.trim(),
            address: textAddress.trim(),
        }])
        setTextTitle('')
        setTextAddress('')
    }

    function handleAddMaps() {
        const result = mapsUrlSchema.safeParse(mapsUrl.trim())
        if (!result.success) {
            setMapsError(result.error.issues[0].message)
            return
        }
        onChange([...value, {
            id: crypto.randomUUID(),
            type: 'maps',
            title: mapsTitle.trim(),
            maps_url: mapsUrl.trim(),
        }])
        setMapsTitle('')
        setMapsUrl('')
        setMapsError('')
    }

    function handleDelete(id: string) {
        onChange(value.filter(l => l.id !== id))
        // TODO: delete from DB
    }

    return (
        <div className="space-y-4">

            {canAdd && (
                <Tabs value={tab} onValueChange={v => setTab(v as LocationType)}>
                    <TabsList className="w-full">
                        <TabsTrigger value="text" className="flex-1 gap-2">
                            <MapPinIcon className="w-4 h-4" />
                            Text address
                        </TabsTrigger>
                        <TabsTrigger value="maps" className="flex-1 gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Google Maps link
                        </TabsTrigger>
                    </TabsList>

                    {/* ── Text address tab ── */}
                    <TabsContent value="text" className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="text-title">
                                Title <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="text-title"
                                placeholder='e.g. فرع المول — Mall Branch'
                                value={textTitle}
                                onChange={e => setTextTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="text-address">Address</Label>
                            <Textarea
                                id="text-address"
                                placeholder="e.g. خلف البنك الأهلي، شارع 23، بورسعيد"
                                value={textAddress}
                                onChange={e => setTextAddress(e.target.value)}
                                rows={2}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2"
                            disabled={!textAddress.trim()}
                            onClick={handleAddText}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add location
                        </Button>
                    </TabsContent>

                    {/* ── Google Maps link tab ── */}
                    <TabsContent value="maps" className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="maps-title">
                                Title <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="maps-title"
                                placeholder='e.g. فرع وسط البلد — Downtown Branch'
                                value={mapsTitle}
                                onChange={e => setMapsTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="maps-url">Google Maps link</Label>
                            <Input
                                id="maps-url"
                                type="url"
                                placeholder="https://maps.app.goo.gl/..."
                                value={mapsUrl}
                                onChange={e => { setMapsUrl(e.target.value); setMapsError('') }}
                            />
                            {mapsError && (
                                <p className="text-xs text-destructive">{mapsError}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Open Google Maps → find your café → tap <strong>Share</strong> → copy the link
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full gap-2"
                            disabled={!mapsUrl.trim()}
                            onClick={handleAddMaps}
                        >
                            <PlusIcon className="w-4 h-4" />
                            Add location
                        </Button>
                    </TabsContent>
                </Tabs>
            )}

            {!canAdd && (
                <p className="text-xs text-muted-foreground text-center">
                    Maximum 3 locations reached.
                </p>
            )}

            {/* Location cards */}
            {value.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        {value.length} location{value.length > 1 ? 's' : ''}
                    </Label>
                    {value.map(location => (
                        <LocationCard
                            key={location.id}
                            location={location}
                            onDelete={() => handleDelete(location.id)}
                        />
                    ))}
                </div>
            )}

        </div>
    )
}

export default LocationSection