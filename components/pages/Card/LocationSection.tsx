"use client"
import { useState } from 'react'
import { Location } from '@/lib/Schema/InfoBusiness'
import { MapPinIcon, NavigationIcon, ExternalLinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

// ── OSM embed URL builder ──────────────────────────────────────────────────

function buildOsmEmbed(lat: string, lng: string): string {
    const latN = parseFloat(lat)
    const lngN = parseFloat(lng)
    const delta = 0.005
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lngN - delta},${latN - delta},${lngN + delta},${latN + delta}&layer=mapnik&marker=${latN},${lngN}`
}

// ── Text location ──────────────────────────────────────────────────────────

function TextLocation({ location }: { location: Location }) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
            <div className="mt-0.5 w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                <MapPinIcon className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <div>
                {location.title && (
                    <p className="text-sm font-medium">{location.title}</p>
                )}
                <p className="text-sm text-muted-foreground">{location.address}</p>
            </div>
        </div>
    )
}

// ── Maps location ──────────────────────────────────────────────────────────

function MapsLocation({ location }: { location: Location }) {
    const [open, setOpen] = useState(false)

    const embedUrl = location.lat && location.lng
        ? buildOsmEmbed(location.lat, location.lng)
        : location.maps_url

    return (
        <>
            {/* ── Card with iframe preview ── */}
            <div
                className="rounded-xl overflow-hidden border border-border/60 cursor-pointer group"
                onClick={() => setOpen(true)}
            >
                {/* Map iframe preview — non-interactive (pointer-events-none so clicks bubble to card) */}
                <div className="relative w-full aspect-video bg-muted overflow-hidden">
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-0 pointer-events-none"
                        loading="lazy"
                        title={location.title || 'Map preview'}
                        scrolling="no"
                    />
                    {/* subtle hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                </div>

                {/* Footer row */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-background border-t border-border/50">
                    <div className="flex items-center gap-2 min-w-0">
                        <MapPinIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <div className="min-w-0">
                            {location.title && (
                                <p className="text-xs font-semibold truncate leading-tight">
                                    {location.title}
                                </p>
                            )}
                            {location.address && (
                                <p className="text-xs text-muted-foreground truncate leading-tight">
                                    {location.address}
                                </p>
                            )}
                        </div>
                    </div>

                    <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 ml-2 text-xs h-7 px-2.5 gap-1.5"
                        onClick={(e) => {
                            e.stopPropagation()
                            setOpen(true)
                        }}
                    >
                        <NavigationIcon className="w-3 h-3" />
                        Directions
                    </Button>
                </div>
            </div>

            {/* ── Full dialog ── */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg p-0 overflow-hidden">
                    <DialogHeader className="px-4 pt-4 pb-2">
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <MapPinIcon className="w-4 h-4 text-emerald-500" />
                            {location.title || 'Location'}
                        </DialogTitle>
                        {location.address && (
                            <p className="text-sm text-muted-foreground mt-0.5 pl-6">
                                {location.address}
                            </p>
                        )}
                    </DialogHeader>

                    <div className="w-full aspect-video bg-muted">
                        <iframe
                            src={embedUrl}
                            className="w-full h-full border-0"
                            loading="lazy"
                            title={location.title || 'Map'}
                        />
                    </div>

                    <div className="flex gap-2 px-4 py-3 border-t border-border">
                        <a
                            href={location.maps_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button className="w-full gap-2" size="sm">
                                <NavigationIcon className="w-3.5 h-3.5" />
                                Get directions
                            </Button>
                        </a>
                        <a href={location.maps_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ExternalLinkIcon className="w-3.5 h-3.5" />
                                Open Maps
                            </Button>
                        </a>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

// ── Main component ─────────────────────────────────────────────────────────

function LocationSection({ locations }: { locations: Location[] }) {
    if (!locations?.length) return null

    return (
        <div className="space-y-3">
            {locations.map(location =>
                location.type === 'maps'
                    ? <MapsLocation key={location.id} location={location} />
                    : <TextLocation key={location.id} location={location} />
            )}
        </div>
    )
}

export default LocationSection