"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { XIcon } from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────────────

type Platform = 'youtube' | 'vimeo' | 'instagram' | 'tiktok' | 'other'

interface VideoItem {
    url: string
    platform: Platform
    embedUrl?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function detectPlatform(url: string): Pick<VideoItem, 'platform' | 'embedUrl'> {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    if (yt) return { platform: 'youtube', embedUrl: `https://www.youtube.com/embed/${yt[1]}` }

    const vimeo = url.match(/vimeo\.com\/(\d+)/)
    if (vimeo) return { platform: 'vimeo', embedUrl: `https://player.vimeo.com/video/${vimeo[1]}` }

    if (url.includes('instagram.com')) return { platform: 'instagram' }
    if (url.includes('tiktok.com')) return { platform: 'tiktok' }

    return { platform: 'other' }
}

const PLATFORM_LABEL: Record<Platform, string> = {
    youtube: 'YouTube', vimeo: 'Vimeo', instagram: 'Instagram', tiktok: 'TikTok', other: 'Video',
}

const PLATFORM_STYLE: Record<Platform, string> = {
    youtube: 'bg-red-50 border-red-200 text-red-600 dark:bg-red-950 dark:border-red-800 dark:text-red-400',
    vimeo: 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-400',
    instagram: 'bg-pink-50 border-pink-200 text-pink-600 dark:bg-pink-950 dark:border-pink-800 dark:text-pink-400',
    tiktok: 'bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400',
    other: 'bg-muted border-border text-muted-foreground',
}

// ── Props ──────────────────────────────────────────────────────────────────

interface VideoSectionProps {
    value: string
    onChange: (value: string) => void
    error?: string
}

// ── Component ──────────────────────────────────────────────────────────────

function VideoSection({ value, onChange, error }: VideoSectionProps) {
    const video = value ? { url: value, ...detectPlatform(value) } : null

    return (
        <div className="space-y-4">

            {/* Input — hidden once a video is added */}
            {!video && (
                <div className="space-y-2">
                    <Label htmlFor="video-url">Video URL</Label>
                    <div className="flex gap-2">
                        <Input
                            id="video-url"
                            type="url"
                            placeholder="YouTube, Vimeo, Instagram, TikTok..."
                            value={value}
                            onChange={e => onChange(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && e.preventDefault()}
                        />
                        <Button
                            type="button"
                            variant="outline"
                            disabled={!value.trim()}
                            onClick={() => onChange(value.trim())}
                        >
                            Add
                        </Button>
                    </div>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
            )}

            {/* Preview */}
            {video && (
                <div className="rounded-lg border border-border overflow-hidden">

                    {video.embedUrl && (
                        <div className="aspect-video w-full bg-muted">
                            <iframe
                                src={video.embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    )}

                    {!video.embedUrl && (
                        <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-3 bg-muted/40 text-sm text-blue-600 underline underline-offset-2 truncate"
                        >
                            {video.url}
                        </a>
                    )}

                    <div className="flex items-center justify-between px-3 py-2 border-t border-border">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${PLATFORM_STYLE[video.platform]}`}>
                            {PLATFORM_LABEL[video.platform]}
                        </span>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                            <XIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    )
}

export default VideoSection