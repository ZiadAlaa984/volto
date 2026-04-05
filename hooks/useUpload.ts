// hooks/useUpload.ts
"use client";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

type UploadOptions = {
    bucket?: string;
    folder?: string;
};

export function useUpload(defaultOptions: UploadOptions = {}) {
    const { session } = useAuth();
    const userId = session?.user?.id;
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFile = async (
        file: File | null | undefined,
        options: UploadOptions = {}
    ): Promise<string | null> => {
        // No file = skip silently, caller gets null back
        if (!file) return null;
        if (!userId) throw new Error("User not authenticated");

        const bucket = options.bucket ?? defaultOptions.bucket ?? "avatars";
        const folder = options.folder ?? defaultOptions.folder ?? userId;

        setIsUploading(true);
        setError(null);

        try {
            const ext = file.name.split(".").pop();
            const fileName = `${Date.now()}.${ext}`;
            const path = `${folder}/${fileName}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(path, file, {
                    upsert: true,
                    contentType: file.type,
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(path);

            return data.publicUrl;
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Upload failed";
            setError(message);
            throw new Error(message);
        } finally {
            setIsUploading(false);
        }
    };

    const deleteFile = async (
        url: string,
        options: UploadOptions = {}
    ): Promise<void> => {
        const bucket = options.bucket ?? defaultOptions.bucket ?? "avatars";

        // Extract path from public URL
        // URL format: .../storage/v1/object/public/{bucket}/{path}
        const marker = `/object/public/${bucket}/`;
        const idx = url.indexOf(marker);
        if (idx === -1) throw new Error("Could not parse storage path from URL");
        const path = url.slice(idx + marker.length);

        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) throw error;
    };

    return {
        uploadFile,
        deleteFile,
        isUploading,
        error,
    };
}