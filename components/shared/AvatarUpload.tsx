"use client"

import { useMemo, useCallback, useRef, useEffect } from "react"
import {
    formatBytes,
    useFileUpload,
    type FileMetadata,
    type FileWithPreview,
} from "@/hooks/use-file-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CircleAlertIcon, CameraIcon, UserIcon, XIcon } from 'lucide-react'

interface AvatarUploadProps {
    maxSize?: number
    className?: string
    value?: File | string | null
    onChange?: (file: File | string | null) => void
    defaultAvatar?: string
}

export function AvatarUpload({
    maxSize = 2 * 1024 * 1024,
    className,
    value,
    onChange,
    defaultAvatar,
}: AvatarUploadProps) {

    const initialFiles = useMemo<FileMetadata[]>(() => {
        if (value instanceof File) {
            return [{
                id: "initial-avatar",
                name: value.name,
                size: value.size,
                type: value.type,
                url: URL.createObjectURL(value),
            }]
        }
        return []
    }, []) // intentionally empty — seed on mount only

    const isInitialMount = useRef(true)

    const pendingChange = useRef<File | string | null | undefined>(undefined)

    const handleFilesChange = useCallback((files: FileWithPreview[]) => {
        if (isInitialMount.current) {
            isInitialMount.current = false
            return
        }
        const raw = files[0]?.file
        pendingChange.current = raw instanceof File ? raw : value ?? null
    }, [value])

    // Flush the pending change after render
    useEffect(() => {
        if (pendingChange.current !== undefined) {
            onChange?.(pendingChange.current)
            pendingChange.current = undefined
        }
    })

    const [
        { files, isDragging, errors },
        {
            removeFile,
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            getInputProps,
            clearFiles,
        },
    ] = useFileUpload({
        maxFiles: 1,
        maxSize,
        accept: "image/*",
        multiple: false,
        initialFiles,
        onFilesChange: handleFilesChange,
    })

    // ── Sync internal state when value is cleared externally ─────────────────
    // When the user deletes and navigates away, formData resets profile_picture
    // to null. On return, value=null but internal files[] still holds the old
    // file. This effect clears internal state to match.
    useEffect(() => {
        if (value == null && files.length > 0) {
            isInitialMount.current = true // suppress the onChange that clearFiles triggers
            clearFiles()
        }
    }, [value])

    const currentFile = files[0]

    const previewUrl = typeof value === "string"
        ? value
        : currentFile?.preview || defaultAvatar

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (currentFile) {
            removeFile(currentFile.id)
        }
        onChange?.(null)
    }

    const fileName = currentFile
        ? currentFile.file instanceof File
            ? currentFile.file.name
            : currentFile.file.name
        : typeof value === "string"
            ? "Current avatar"
            : "Click or drag to upload"

    return (
        <div className={cn("flex flex-col items-center gap-4", className)}>
            <div className="relative">
                <div
                    className={cn(
                        "group relative h-28 w-28 cursor-pointer overflow-hidden rounded-full border-2 border-dashed transition-all duration-200",
                        isDragging
                            ? "border-primary bg-primary/10 scale-105"
                            : "border-muted-foreground/30 hover:border-primary/50",
                        previewUrl && "border-solid border-muted-foreground/20"
                    )}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={openFileDialog}
                >
                    <input {...getInputProps()} className="sr-only" />

                    {previewUrl ? (
                        <>
                            <img src={previewUrl} alt="Avatar" className="h-full w-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <CameraIcon className="text-white size-6" />
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-1">
                            <UserIcon className="text-muted-foreground size-7" />
                            <CameraIcon className="text-muted-foreground/60 size-3.5" />
                        </div>
                    )}
                </div>

                {(currentFile || typeof value === "string") && (
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={handleRemove}
                        className="absolute end-0.5 top-0.5 z-10 size-6 rounded-full shadow-sm"
                        aria-label="Remove avatar"
                    >
                        <XIcon className="size-3" />
                    </Button>
                )}
            </div>

            <div className="space-y-0.5 text-center">
                <p className="text-sm font-medium">{fileName}</p>
                <p className="text-muted-foreground text-xs">
                    PNG, JPG up to {formatBytes(maxSize)}
                </p>
            </div>

            {errors.length > 0 && (
                <Alert variant="destructive">
                    <CircleAlertIcon />
                    <AlertTitle>Upload error</AlertTitle>
                    <AlertDescription>
                        {errors.map((error: string, i: number) => (
                            <p key={i}>{error}</p>
                        ))}
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}