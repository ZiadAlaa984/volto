import { z } from "zod";

export const BasicInfoSchema = z.object({
    name: z
        .string()
        .min(3, "Name must be at least 3 characters")
        .max(48, "Name must be at most 48 characters"),
    bio: z.string().max(60, "Bio must be at most 60 characters").optional(),
});

export type BasicInfoFormValues = z.infer<typeof BasicInfoSchema>;
