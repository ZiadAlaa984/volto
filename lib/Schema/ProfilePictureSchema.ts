import { z } from "zod";

export const ProfilePictureSchema = z.object({
    profile_picture: z
        .instanceof(File)
        .nullable()
        .optional(),
});

export type ProfilePictureSchema = z.infer<typeof ProfilePictureSchema>;