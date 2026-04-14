"use client";

import { mapsUrlSchema } from "@/lib/Schema/mapsUrlSchema";
import { useEffect, useRef, useState } from "react";

type ResolveStatus = "idle" | "loading" | "success" | "no-coords" | "error";



function useResolvedMapsUrl(url: string, debounceMs = 800) {
    interface ResolveResult {
        resolvedUrl: string;
        lat?: string;
        lng?: string;
    }
    const [status, setStatus] = useState<ResolveStatus>("idle");
    const [result, setResult] = useState<ResolveResult | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!url.trim()) {
            setStatus("idle");
            setResult(null);
            return;
        }

        const parsed = mapsUrlSchema.safeParse(url.trim());
        if (!parsed.success) {
            setStatus("error");
            setResult(null);
            return;
        }

        setStatus("loading");

        const timer = setTimeout(async () => {
            abortRef.current?.abort();
            abortRef.current = new AbortController();

            try {
                const res = await fetch(
                    `/api/resolve-maps?url=${encodeURIComponent(url.trim())}`,
                    { signal: abortRef.current.signal }
                );

                if (!res.ok) {
                    setStatus("error");
                    setResult(null);
                    return;
                }

                const data = await res.json();
                setResult(data);
                setStatus(data.lat && data.lng ? "success" : "no-coords");
            } catch (err: unknown) {
                if (err instanceof Error && err.name === "AbortError") return;
                setStatus("error");
                setResult(null);
            }
        }, debounceMs);

        return () => {
            clearTimeout(timer);
            abortRef.current?.abort();
        };
    }, [url, debounceMs]);

    return { status, result };
}

export default useResolvedMapsUrl;