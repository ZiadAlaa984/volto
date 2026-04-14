import { z } from "zod";

export const CardInfoSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(48, "Name must be at most 48 characters"),
    // ─── FIX: aligned with Card interface — empty string allowed, not undefined
    bio: z
        .string()
        .max(60, "Bio must be at most 60 characters")
        .optional(),
    profile_picture: z
        .union([z.string(), z.instanceof(File)])
        .nullable()
        .optional(),
});

export type CardInfoFormValues = z.infer<typeof CardInfoSchema>;

// ─── Card interface ───────────────────────────────────────────────────────────
// bio is optional here to safely handle rows where it may be null in the DB
export interface Card {
    id: string;
    user_id: string;
    card_type: 'business' | 'personal';
    name: string;
    bio?: string;           // ─── FIX: optional to match schema's .optional()
    created_at: string;
    profile_picture: string | File | null; // ─── FIX: matches schema union type
}