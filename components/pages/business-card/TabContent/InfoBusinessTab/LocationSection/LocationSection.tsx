"use client"
import { useState } from 'react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MapPinIcon, LinkIcon, XIcon, PlusIcon } from 'lucide-react'
import { Location } from '@/lib/Schema/InfoBusiness'

type LocationType = 'text' | 'maps'

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
                u.hostname.includes('google.com') ||
                u.hostname.includes('maps.app.goo.gl') ||
                u.hostname.includes('goo.gl')
            )
        } catch {
            return false
        }
    },
    { message: 'Please paste a valid Google Maps link' }
)

// ── Lat/lng extractor ──────────────────────────────────────────────────────
// Handles these Google Maps URL formats:
// https://www.google.com/maps?q=31.2525,32.2948
// https://www.google.com/maps/place/.../@31.2525,32.2948,17z
// https://maps.app.goo.gl/xxx  → can't extract, stored as-is

function extractLatLng(url: string): { lat?: string; lng?: string } {
    try {
        // Format: @lat,lng,zoom
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
        if (atMatch) return { lat: atMatch[1], lng: atMatch[2] }

        // Format: ?q=lat,lng
        const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/)
        if (qMatch) return { lat: qMatch[1], lng: qMatch[2] }

        // Format: /place/name/lat,lng
        const placeMatch = url.match(/\/place\/[^/]+\/(-?\d+\.\d+),(-?\d+\.\d+)/)
        if (placeMatch) return { lat: placeMatch[1], lng: placeMatch[2] }

        return {}
    } catch {
        return {}
    }
}

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
                        {location.type === 'maps' && (
                            <div className="flex items-center gap-2">
                                <a
                                    href={location.maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Open in Google Maps ↗
                                </a>
                                {location.lat && location.lng && (
                                    <span className="text-xs text-emerald-600">✓ Map preview available</span>
                                )}
                            </div>
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
    const [textTitle, setTextTitle] = useState('')
    const [textAddress, setTextAddress] = useState('')
    const [mapsTitle, setMapsTitle] = useState('')
    const [mapsUrl, setMapsUrl] = useState('')
    const [mapsError, setMapsError] = useState('')

    const canAdd = value.length < 3

    // extract lat/lng live as user types so they get feedback
    const { lat, lng } = extractLatLng(mapsUrl)
    const hasCoords = !!lat && !!lng

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
        const coords = extractLatLng(mapsUrl.trim())
        onChange([...value, {
            id: crypto.randomUUID(),
            type: 'maps',
            title: mapsTitle.trim(),
            maps_url: mapsUrl.trim(),
            lat: coords.lat,
            lng: coords.lng,
        }])
        setMapsTitle('')
        setMapsUrl('')
        setMapsError('')
    }

    function handleDelete(id: string) {
        onChange(value.filter(l => l.id !== id))
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

                    {/* ── Text address ── */}
                    <TabsContent value="text" className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="text-title">
                                Title <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="text-title"
                                placeholder="Mall Branch"
                                value={textTitle}
                                onChange={e => setTextTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="text-address">Address</Label>
                            <Textarea
                                id="text-address"
                                placeholder="123 Main St, City, Country"
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

                    {/* ── Google Maps link ── */}
                    <TabsContent value="maps" className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="maps-title">
                                Title <span className="text-muted-foreground font-normal">(optional)</span>
                            </Label>
                            <Input
                                id="maps-title"
                                placeholder="Downtown Branch"
                                value={mapsTitle}
                                onChange={e => setMapsTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="maps-url">Google Maps link</Label>
                            <Input
                                id="maps-url"
                                type="url"
                                placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/..."
                                value={mapsUrl}
                                onChange={e => { setMapsUrl(e.target.value); setMapsError('') }}
                            />
                            {/* Live feedback on coords extraction */}
                            {mapsUrl && (
                                <p className={`text-xs ${hasCoords ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {hasCoords
                                        ? `✓ Map preview will be available (${lat}, ${lng})`
                                        : '⚠ Map preview not available for short links — use the full Google Maps URL for best results'
                                    }
                                </p>
                            )}
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