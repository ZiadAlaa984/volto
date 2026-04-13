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
    const delta = 0.005 // zoom level
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
    const hasEmbed = !!location.lat && !!location.lng
    const embedUrl = hasEmbed ? buildOsmEmbed(location.lat!, location.lng!) : null

    return (
        <>
            <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-7 h-7 rounded-full bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                        <MapPinIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                        {location.title && (
                            <p className="text-sm font-medium">{location.title}</p>
                        )}
                        {hasEmbed ? (
                            <button
                                onClick={() => setOpen(true)}
                                className="text-sm text-blue-600 hover:underline underline-offset-2"
                            >
                                View on map
                            </button>
                        ) : (
                            <a
                                href={location.maps_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline underline-offset-2"
                            >
                                Open in Google Maps ↗
                            </a>
                        )}
                    </div>
                </div>
                <a href={location.maps_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <NavigationIcon className="w-3 h-3" />
                        Directions
                    </Button>
                </a>
            </div>

            {hasEmbed && (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="max-w-lg p-0 overflow-hidden">
                        <DialogHeader className="px-4 pt-4 pb-2">
                            <DialogTitle className="flex items-center gap-2 text-base">
                                <MapPinIcon className="w-4 h-4 text-emerald-500" />
                                {location.title || 'Location'}
                            </DialogTitle>
                        </DialogHeader>

                        {/* OpenStreetMap embed — free, no API key needed */}
                        <div className="w-full aspect-video bg-muted">
                            <iframe
                                src={embedUrl!}
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
            )}
        </>
    )
}

// ── Main component ─────────────────────────────────────────────────────────

function Locations({ locations }: { locations: Location[] }) {
    if (!locations?.length) return null

    return (
        <div>
            {locations.map(location =>
                location.type === 'maps'
                    ? <MapsLocation key={location.id} location={location} />
                    : <TextLocation key={location.id} location={location} />
            )}
        </div>
    )
}

export default Locations