import { z } from "zod";

export const userNameSchema = z.object({
    user_name: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(48, "Username must be at most 48 characters")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Only lowercase letters, numbers, and hyphens allowed",
        ),
});

export type UserNameFormValues = z.infer<typeof userNameSchema>;
