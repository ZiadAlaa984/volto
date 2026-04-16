"use client"
import { useRef } from 'react'
import { ExternalLinkIcon, FileTextIcon, ImageIcon, UploadIcon, XIcon } from 'lucide-react'

interface FileUploadProps {
    accept: string
    maxSizeMB?: number
    value: File | null
    savedUrl?: string           // existing uploaded-file URL from DB (type === "file")
    onChange: (file: File | null) => void
    error?: string
}

function getFileIcon(file: File) {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-muted-foreground" />
    return <FileTextIcon className="w-4 h-4 text-muted-foreground" />
}

function formatSize(bytes: number): string {
    return bytes < 1024 * 1024
        ? `${(bytes / 1024).toFixed(1)} KB`
        : `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function FileUpload({ accept, maxSizeMB = 10, value, savedUrl, onChange, error }: FileUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > maxSizeMB * 1024 * 1024) {
            onChange(null)
            if (inputRef.current) inputRef.current.value = ''
            return
        }

        onChange(file)
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        const file = e.dataTransfer.files?.[0]
        if (!file) return
        if (file.size > maxSizeMB * 1024 * 1024) return
        onChange(file)
    }

    // ── Newly selected File (not yet saved) ────────────────────────────────
    if (value) {
        return (
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                    {getFileIcon(value)}
                    <div className="min-w-0">
                        <p className="text-sm truncate">{value.name}</p>
                        <p className="text-xs text-muted-foreground">{formatSize(value.size)}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => { onChange(null); if (inputRef.current) inputRef.current.value = '' }}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-2"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        )
    }

    // ── Already-saved file URL from DB (type === "file") ───────────────────
    if (savedUrl) {
        return (
            <div className="flex items-center justify-between rounded-md border border-border px-3 py-2.5">
                <div className="flex items-center gap-2 min-w-0">
                    <FileTextIcon className="w-4 h-4 text-muted-foreground" />
                    <a
                        href={savedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline underline-offset-2 truncate hover:opacity-80 flex items-center gap-1"
                    >
                        Uploaded file
                        <ExternalLinkIcon className="w-3 h-3 shrink-0" />
                    </a>
                </div>
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className="text-muted-foreground hover:text-destructive transition-colors shrink-0 ml-2"
                >
                    <XIcon className="w-4 h-4" />
                </button>
            </div>
        )
    }

    // ── Empty dropzone ─────────────────────────────────────────────────────
    return (
        <div className="space-y-1.5">
            <label
                className={`flex flex-col items-center justify-center gap-2 border border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors ${error ? 'border-destructive' : 'border-border'}`}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
            >
                <UploadIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click or drag to upload</span>
                <span className="text-xs text-muted-foreground">
                    {accept.replace('application/pdf', 'PDF').replace('image/*', 'Images')} · up to {maxSizeMB} MB
                </span>
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleChange}
                />
            </label>
            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    )
}

export default FileUpload