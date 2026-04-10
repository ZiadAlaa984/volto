import { z } from "zod";

export const ProfilePictureSchema = z.object({
    profile_picture: z
        .union([z.instanceof(File), z.string()])
        .nullable()
        .optional(),
});

export type ProfilePictureSchema = z.infer<typeof ProfilePictureSchema>;