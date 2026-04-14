"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LinkIcon, Loader2Icon, MapPinIcon, PlusIcon, XIcon } from "lucide-react";
import { Location } from "@/lib/Schema/InfoBusiness";
import { useState } from "react";
import useResolvedMapsUrl from "@/hooks/useResolvedMapsUrl";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_LOCATIONS = 3;

// ─── Types ────────────────────────────────────────────────────────────────────

export type LocationTabValue = "address" | "google-map";

export interface LocationSectionProps {
    value: Location[];
    onChange: (locations: Location[]) => void;
    activeTab: LocationTabValue;
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

// ─── Maps Form ────────────────────────────────────────────────────────────────

interface MapsFormProps {
    onAdd: (location: Location) => void;
}

function MapsForm({ onAdd }: MapsFormProps) {
    const [title, setTitle] = useState("");
    const [url, setUrl] = useState("");

    const { status, result } = useResolvedMapsUrl(url);

    function handleAdd() {
        if (!url.trim() || status === "error") return;
        onAdd({
            id: crypto.randomUUID(),
            type: "maps",
            title: title.trim(),
            maps_url: result?.resolvedUrl ?? url.trim(),
            lat: result?.lat,
            lng: result?.lng,
        });
        setTitle("");
        setUrl("");
    }

    const hint = (() => {
        if (!url) return null;
        switch (status) {
            case "loading":
                return (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Loader2Icon className="w-3 h-3 animate-spin" />
                        Resolving link…
                    </span>
                );
            case "success":
                return (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        ✓ Map preview will be available ({result!.lat}, {result!.lng})
                    </span>
                );
            case "no-coords":
                return (
                    <span className="text-xs text-amber-600 dark:text-amber-400">
                        ⚠ Link resolved but no coordinates found — preview unavailable
                    </span>
                );
            case "error":
                return (
                    <span className="text-xs text-destructive">
                        Please paste a valid Google Maps link
                    </span>
                );
            default:
                return null;
        }
    })();

    const canSubmit =
        url.trim().length > 0 && status !== "error" && status !== "loading";

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
                    onChange={(e) => setUrl(e.target.value)}
                />
                {hint}
                <p className="text-xs text-muted-foreground">
                    Open Google Maps → find your location → copy{" "}
                    <strong>any link</strong> (short or full) → paste here
                </p>
            </div>
            <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                disabled={!canSubmit}
                onClick={handleAdd}
            >
                {status === "loading" ? (
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                ) : (
                    <LinkIcon className="w-4 h-4" />
                )}
                Add location
            </Button>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LocationSection({ value, onChange, activeTab }: LocationSectionProps) {
    const canAdd = value.length < MAX_LOCATIONS;

    function handleAdd(location: Location) {
        onChange([...value, location]);
    }

    function handleDelete(id: string) {
        onChange(value.filter((l) => l.id !== id));
    }

    return (
        <div className="space-y-4">
            {/* Form — driven by activeTab from FloatingTabs in the card header */}
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