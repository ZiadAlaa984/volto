"use client"

import { useMemo } from "react"
import {
    formatBytes,
    useFileUpload,
    type FileMetadata,
} from "@/hooks/use-file-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { CircleAlertIcon, CameraIcon, UserIcon, XIcon } from 'lucide-react'

interface AvatarUploadProps {
    maxSize?: number
    className?: string
    value?: File | null
    onChange?: (file: File | null) => void
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
        if (!value) return []
        return [{
            id: "initial-avatar",
            name: value.name,
            size: value.size,
            type: value.type,
            url: URL.createObjectURL(value),
        }]
    }, []) // empty deps — seed once on mount only

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
        },
    ] = useFileUpload({
        maxFiles: 1,
        maxSize,
        accept: "image/*",
        multiple: false,
        initialFiles,
        onFilesChange: (files) => {
            const raw = files[0]?.file
            // Only pass back real File objects, not FileMetadata (initial seed)
            onChange?.(raw instanceof File ? raw : value ?? null)
        },
    })

    const currentFile = files[0]
    const previewUrl = currentFile?.preview || defaultAvatar

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (currentFile) {
            removeFile(currentFile.id)
            onChange?.(null)
        }
    }

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
                            <img
                                src={previewUrl}
                                alt="Avatar"
                                className="h-full w-full object-cover"
                            />
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

                {currentFile && (
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
                <p className="text-sm font-medium">
                    {currentFile ? currentFile.file.name : "Click or drag to upload"}
                </p>
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