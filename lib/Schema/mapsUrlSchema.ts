// ─── Validation ───────────────────────────────────────────────────────────────

import z from "zod";

export const mapsUrlSchema = z.string().refine(
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