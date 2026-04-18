"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Play, ExternalLink, Loader2 } from "lucide-react"

type Platform = "youtube" | "tiktok" | "instagram"

interface VideoMeta {
    platform: Platform
    embedUrl: string
    thumbnailUrl: string
    label: string
    originalUrl: string
}

function parseVideoUrl(src: string): VideoMeta | null {
    const ytMatch = src.match(
        /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    )
    if (ytMatch) {
        return {
            platform: "youtube",
            embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`,
            thumbnailUrl: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
            label: "YouTube",
            originalUrl: src,
        }
    }

    const ttMatch = src.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)
    if (ttMatch) {
        return {
            platform: "tiktok",
            embedUrl: `https://www.tiktok.com/embed/v2/${ttMatch[1]}`,
            thumbnailUrl: "",
            label: "TikTok",
            originalUrl: src,
        }
    }

    const igMatch = src.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/)
    if (igMatch) {
        return {
            platform: "instagram",
            embedUrl: `https://www.instagram.com/p/${igMatch[1]}/embed`,
            thumbnailUrl: "",
            label: "Instagram",
            originalUrl: src,
        }
    }

    return null
}

// ── Icons ───────────────────────────────────────────────────────
const YouTubeIcon = () => (
    <svg width="20" height="14" viewBox="0 0 20 14" className="shrink-0">
        <rect width="20" height="14" rx="3" fill="#FF0000" />
        <polygon points="8,3 8,11 15,7" fill="white" />
    </svg>
)

const TikTokIcon = () => (
    <svg width="16" height="18" viewBox="0 0 16 18" className="shrink-0" fill="currentColor">
        <path d="M11.5 0h-2.8v12.2a2.7 2.7 0 0 1-2.7 2.5 2.7 2.7 0 0 1-2.7-2.7 2.7 2.7 0 0 1 2.7-2.7c.26 0 .51.04.75.1V6.5a5.5 5.5 0 0 0-.75-.05A5.5 5.5 0 0 0 0 12a5.5 5.5 0 0 0 5.5 5.5A5.5 5.5 0 0 0 11 12V5.8a8.2 8.2 0 0 0 4.8 1.5V4.5a5.4 5.4 0 0 1-4.3-4.5z" />
    </svg>
)

const InstagramIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 18 18" fill="none" className="shrink-0">
        <rect x="1" y="1" width="16" height="16" rx="4" stroke="url(#ig-grad)" strokeWidth="1.5" />
        <circle cx="9" cy="9" r="3.5" stroke="url(#ig-grad)" strokeWidth="1.5" />
        <circle cx="13.2" cy="4.8" r="1" fill="url(#ig-grad)" />
        <defs>
            <linearGradient id="ig-grad" x1="1" y1="17" x2="17" y2="1" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F9CE34" />
                <stop offset="0.4" stopColor="#EE2A7B" />
                <stop offset="1" stopColor="#6228D7" />
            </linearGradient>
        </defs>
    </svg>
)

const PlatformIcon = ({ platform }: { platform: Platform }) => {
    if (platform === "youtube") return <YouTubeIcon />
    if (platform === "tiktok") return <TikTokIcon />
    return <InstagramIcon />
}

// ── Shared link-out card (Instagram + TikTok) ───────────────────
interface LinkOutCardProps {
    meta: VideoMeta
    aspectClass: string
    gradient: string
    label: string
    sublabel: string
    icon: React.ReactNode
}

function LinkOutCard({ meta, aspectClass, gradient, label, sublabel, icon }: LinkOutCardProps) {
    const [thumb, setThumb] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const encoded = encodeURIComponent(meta.originalUrl)
        fetch(`https://api.microlink.io/?url=${encoded}`)
            .then((r) => r.json())
            .then((data) => setThumb(data?.data?.image?.url ?? null))
            .catch(() => setThumb(null))
            .finally(() => setLoading(false))
    }, [meta.originalUrl])

    return (
        <Card
            className="overflow-hidden rounded-2xl border group cursor-pointer"
            onClick={() => window.open(meta.originalUrl, "_blank", "noopener,noreferrer")}
        >
            <div className={`relative w-full ${aspectClass} bg-black overflow-hidden`}>
                {/* thumbnail or gradient fallback */}
                {thumb ? (
                    <img
                        src={thumb}
                        alt="Video thumbnail"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className={`absolute inset-0 ${gradient}`}>
                        <div className="absolute w-40 h-40 rounded-full bg-white/10 -top-10 -left-10" />
                        <div className="absolute w-28 h-28 rounded-full bg-white/10 bottom-6 right-6" />
                    </div>
                )}

                {/* overlay — lighter when thumbnail loaded */}
                <div className={`absolute inset-0 ${thumb ? "bg-black/40" : "bg-black/20"}`} />

                {/* spinner */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
                    </div>
                )}

                {/* single play button — no nested button wrapper */}
                {!loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play className="w-7 h-7 text-white fill-white ml-1" />
                        </div>
                        <span className="text-white/90 text-sm font-medium tracking-wide drop-shadow">
                            {label}
                        </span>
                    </div>
                )}

                {/* top-right external icon */}
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-white" />
                </div>
            </div>

            {/* footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center gap-3">
                    {icon}
                    <div>
                        <p className="text-sm font-medium leading-none">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground border rounded-full px-3 py-1.5 group-hover:bg-muted transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    Open
                </div>
            </div>
        </Card>
    )
}

// ── YouTube embed card ──────────────────────────────────────────
function YouTubeCard({ meta }: { meta: VideoMeta }) {
    const [playing, setPlaying] = useState(false)

    return (
        <Card className="overflow-hidden w-full rounded-2xl border">
            <div className="relative w-full aspect-video bg-black">
                {playing ? (
                    <iframe
                        src={meta.embedUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                    />
                ) : (
                    // single div — no <button> wrapper to avoid double play UI
                    <div
                        className="absolute inset-0 cursor-pointer group"
                        onClick={() => setPlaying(true)}
                    >
                        <img
                            src={meta.thumbnailUrl}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                        />
                        {/* overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                        {/* single play button */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-white fill-white ml-1" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 px-4 py-3 border-t">
                <YouTubeIcon />
                <div className="min-w-0">
                    <p className="text-sm font-medium">Watch on YouTube</p>
                    <p className="text-xs text-muted-foreground">YouTube · Video</p>
                </div>
            </div>
        </Card>
    )
}

// ── Main export ─────────────────────────────────────────────────
export default function VideoSection({ src }: { src: string }) {
    const meta = parseVideoUrl(src)
    if (!meta) return null

    if (meta.platform === "youtube") return <YouTubeCard meta={meta} />

    if (meta.platform === "instagram") {
        const shortcode = src.match(/instagram\.com\/(?:reel|p)\/([\w-]+)/)?.[1] ?? ""
        return (
            <LinkOutCard
                meta={meta}
                aspectClass="aspect-[4/5]"
                gradient="bg-gradient-to-br from-[#F9CE34] via-[#EE2A7B] to-[#6228D7]"
                label="Watch Reel"
                sublabel={`instagram.com/reel/${shortcode.slice(0, 12)}…`}
                icon={<InstagramIcon size={22} />}
            />
        )
    }

    // TikTok
    const videoId = src.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)?.[1] ?? ""
    return (
        <LinkOutCard
            meta={meta}
            aspectClass="aspect-[4/5]"
            gradient="bg-gradient-to-br from-[#010101] via-[#EE1D52] to-[#69C9D0]"
            label="Watch on TikTok"
            sublabel={`tiktok.com/video/${videoId.slice(0, 10)}…`}
            icon={<TikTokIcon />}
        />
    )
}