import { NextRequest, NextResponse } from "next/server";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isGoogleMapsUrl(url: string): boolean {
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
}

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

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const rawUrl = searchParams.get("url");

    // 1. Presence check
    if (!rawUrl) {
        return NextResponse.json(
            { error: "Missing `url` query parameter" },
            { status: 400 }
        );
    }

    // 2. Basic Google Maps domain check (before we even fetch)
    if (!isGoogleMapsUrl(rawUrl)) {
        return NextResponse.json(
            { error: "Not a valid Google Maps link" },
            { status: 400 }
        );
    }

    // 3. Follow redirects server-side (handles goo.gl / maps.app.goo.gl short URLs)
    let resolvedUrl = rawUrl;
    try {
        const response = await fetch(rawUrl, {
            method: "HEAD", // HEAD is enough — we only need the final URL
            redirect: "follow",
        });
        resolvedUrl = response.url ?? rawUrl;
    } catch {
        // If fetch fails (e.g. network error), fall back to the raw URL.
        // We still try to extract coords — some long URLs work without following.
        resolvedUrl = rawUrl;
    }

    // 4. Extract coordinates from the resolved URL
    const { lat, lng } = extractLatLng(resolvedUrl);

    return NextResponse.json({ resolvedUrl, lat, lng });
}