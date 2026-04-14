"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPinIcon, LinkIcon, XIcon, PlusIcon } from "lucide-react";
import { Location } from "@/lib/Schema/InfoBusiness";

// ─── Types ────────────────────────────────────────────────────────────────────

export type LocationTabValue = "address" | "google-map";

export interface LocationSectionProps {
    value: Location[];
    onChange: (locations: Location[]) => void;
    /** Controlled by the FloatingTabs in the Card header */
    activeTab: LocationTabValue;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const mapsUrlSchema = z.string().refine(
    (url) => {
        try {
            const u = new URL(url);
            return (
                u.hostname.includes("google.com") ||
                u.hostname.includes("maps.app.goo.gl") ||
                u.hostname.includes("goo.gl")
            );
        } catch {
            return false;
        }
    },
    { message: "Please paste a valid Google Maps link" }
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Extracts lat/lng from common Google Maps URL formats:
 *  - @lat,lng,zoom
 *  - ?q=lat,lng
 *  - /place/name/lat,lng
 */
function extractLatLng(url: string): { lat?: string; lng?: string } {
    try {
        const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (atMatch) return { lat: atMatch[1], lng: atMatch[2] };

        const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (qMatch) return { lat: qMatch[1], lng: qMatch[2] };

        const placeMatch = url.match(/\/place\/[^/]+\/(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (placeMatch) return { lat: placeMatch[1], lng: placeMatch[2] };

        return {};
    } catch {
        return {};
    }
}

// ─── Location Card ────────────────────────────────────────────────────────────

interface LocationCardProps {
    location: Location;
    onDelete: () => void;
}

function LocationCard({ location, onDelete }: LocationCardProps) {
    return (
        <div className="rounded-lg border border-border bg-card p-3 space-y-1">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                    <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-primary" />

                    <div className="space-y-0.5">
                        {location.title && (
                            <p className="text-sm font-medium">{location.title}</p>
                        )}

                        {location.type === "text" && location.address && (
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                {location.address}
                            </p>
                        )}

                        {location.type === "maps" && (
                            <div className="flex flex-wrap items-center gap-2">
                                <a
                                    href={location.maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Open in Google Maps ↗
                                </a>
                                {location.lat && location.lng && (
                                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                        ✓ Preview available
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onDelete}
                    aria-label="Remove location"
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

// ─── Address Form ─────────────────────────────────────────────────────────────

interface AddressFormProps {
    onAdd: (location: Location) => void;
}

function AddressForm({ onAdd }: AddressFormProps) {
    const [title, setTitle] = useState("");
    const [address, setAddress] = useState("");

    function handleAdd() {
        if (!address.trim()) return;
        onAdd({
            id: crypto.randomUUID(),
            type: "text",
            title: title.trim(),
            address: address.trim(),
        });
        setTitle("");
        setAddress("");
    }

    return (
        <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
                <Label htmlFor="text-title">
                    Title{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                    id="text-title"
                    placeholder="Mall Branch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="text-address">Address</Label>
                <Textarea
                    id="text-address"
                    placeholder="123 Main St, City, Country"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                />
            </div>

            <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={!address.trim()}
                onClick={handleAdd}
            >
                <PlusIcon className="w-4 h-4" />
                Add location
            </Button>
        </div>
    );
}

// ─── Google Maps Form ─────────────────────────────────────────────────────────

interface MapsFormProps {
    onAdd: (location: Location) => void;
}

function MapsForm({ onAdd }: MapsFormProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");
    const [error, setError] = useState("");

    const { lat, lng } = extractLatLng(url);
    const hasCoords = !!lat && !!lng;

    function handleAdd() {
        const result = mapsUrlSchema.safeParse(url.trim());
        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }
        const coords = extractLatLng(url.trim());
        onAdd({
            id: crypto.randomUUID(),
            type: "maps",
            title: title.trim(),
            maps_url: url.trim(),
            lat: coords.lat,
            lng: coords.lng,
        });
        setTitle("");
        setUrl("");
        setError("");
    }

    return (
        <div className="space-y-3 pt-2">
            <div className="space-y-1.5">
                <Label htmlFor="maps-title">
                    Title{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                    id="maps-title"
                    placeholder="Downtown Branch"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div className="space-y-1.5">
                <Label htmlFor="maps-url">Google Maps link</Label>
                <Input
                    id="maps-url"
                    type="url"
                    placeholder="https://maps.app.goo.gl/... or https://www.google.com/maps/..."
                    value={url}
                    onChange={(e) => {
                        setUrl(e.target.value);
                        setError("");
                    }}
                />

                {url && (
                    <p
                        className={`text-xs ${hasCoords
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                    >
                        {hasCoords
                            ? `✓ Map preview will be available (${lat}, ${lng})`
                            : "⚠ Use the full Google Maps URL for a map preview"}
                    </p>
                )}

                {error && <p className="text-xs text-destructive">{error}</p>}

                <p className="text-xs text-muted-foreground">
                    Open Google Maps → find your location → copy the{" "}
                    <strong>browser URL</strong> → paste here
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
                Add location
            </Button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const MAX_LOCATIONS = 3;

function LocationSection({ value, onChange, activeTab }: LocationSectionProps) {
    const canAdd = value.length < MAX_LOCATIONS;

    function handleAdd(location: Location) {
        onChange([...value, location]);
    }

    function handleDelete(id: string) {
        onChange(value.filter((l) => l.id !== id));
    }

    return (
        <div className="space-y-4">
            {/* Form — driven by parent FloatingTabs */}
            {canAdd ? (
                activeTab === "address" ? (
                    <AddressForm onAdd={handleAdd} />
                ) : (
                    <MapsForm onAdd={handleAdd} />
                )
            ) : (
                <p className="text-xs text-muted-foreground text-center py-2">
                    Maximum {MAX_LOCATIONS} locations reached.
                </p>
            )}

            {/* Saved locations list */}
            {value.length > 0 && (
                <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                        {value.length} location{value.length > 1 ? "s" : ""}
                    </Label>
                    {value.map((location) => (
                        <LocationCard
                            key={location.id}
                            location={location}
                            onDelete={() => handleDelete(location.id)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default LocationSection;