"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check, Share2, QrCode } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getInitials } from "./ProfileHeader";
import { cn } from "@/lib/utils";

const SOCIAL_LINKS = [
    {
        label: "Copy Link",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5" >
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                < path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
        ),
        bg: "bg-gray-100 dark:bg-zinc-800",
        color: "text-gray-700 dark:text-zinc-200",
        action: "copy",
    },
    {
        label: "X",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
        bg: "bg-black",
        color: "text-white",
        href: (url: string) => `https://x.com/intent/tweet?url=${encodeURIComponent(url)}`,
    },
    {
        label: "Facebook",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
        bg: "bg-[#1877F2]",
        color: "text-white",
        href: (url: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
        label: "WhatsApp",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
        bg: "bg-[#25D366]",
        color: "text-white",
        href: (url: string) => `https://wa.me/?text=${encodeURIComponent(url)}`,
    },
    {
        label: "LinkedIn",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
        bg: "bg-[#0A66C2]",
        color: "text-white",
        href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
    {
        label: "Messenger",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" >
                <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.652V24l4.088-2.242c1.092.3 2.246.464 3.443.464 6.627 0 12-4.975 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26L10.732 8l3.131 3.259L19.752 8l-6.561 6.963z" />
            </svg>
        ),
        bg: "bg-gradient-to-br from-[#0099FF] to-[#A033FF]",
        color: "text-white",
        href: (url: string) => `https://m.me/?link=${encodeURIComponent(url)}`,
    },
    {
        label: "Telegram",
        icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
            </svg>
        ),
        bg: "bg-[#26A5E4]",
        color: "text-white",
        href: (url: string) => `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    },
];

interface ShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    username: string;
    displayName: string;
    profile_picture?: string;
    children?: React.ReactNode;
}

type Tab = "share" | "qr";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "share", label: "Share", icon: <Share2 className="w-3.5 h-3.5" /> },
    { id: "qr", label: "QR Code", icon: <QrCode className="w-3.5 h-3.5" /> },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function TabSwitcher({
    active,
    onChange,
}: {
    active: Tab;
    onChange: (tab: Tab) => void;
}) {
    return (
        <div className="flex mx-5 mt-4 bg-muted rounded-2xl p-1 gap-1">
            {TABS.map(({ id, label, icon }) => (
                <button
                    key={id}
                    onClick={() => onChange(id)}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                        active === id
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {icon}
                    {label}
                </button>
            ))}
        </div>
    );
}

function ProfileCard({
    displayName,
    username,
    profile_picture,
}: {
    displayName: string;
    username: string;
    profile_picture?: string;
}) {
    return (
        <div className="rounded-2xl overflow-hidden bg-[#2C2416] relative">
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 30% 50%, #8B6914 0%, transparent 60%)",
                }}
            />
            <div className="relative flex flex-col items-center py-6 px-4 gap-3">
                <Avatar className="size-20 ring-2 ring-white/20 shadow-lg">
                    <AvatarImage
                        src={profile_picture ?? ""}
                        className="object-cover"
                        alt={displayName}
                    />
                    <AvatarFallback className="text-lg font-bold bg-amber-700 text-white">
                        {getInitials(displayName)}
                    </AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <p className="text-white font-bold text-base">{displayName}</p>
                </div>
            </div>
        </div>
    );
}

function SocialGrid({
    url,
    copied,
    onCopy,
}: {
    url: string;
    copied: boolean;
    onCopy: () => void;
}) {
    return (
        <ScrollArea className="w-[335px] md:w-[472px]">
            <div className="flex flex-row py-6 gap-4 pb-2">
                {SOCIAL_LINKS.map((s) => (
                    <button
                        key={s.label}
                        onClick={s.action === "copy" ? onCopy : () => window.open(s.href!(url), "_blank")}
                        className="flex flex-col items-center gap-1.5 group shrink-0"
                    >
                        <div
                            className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shadow-sm",
                                "transition-transform duration-150 group-hover:scale-110 group-active:scale-95",
                                s.bg,
                                s.color
                            )}
                        >
                            {s.action === "copy" && copied ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                s.icon
                            )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-medium">
                            {s.action === "copy" && copied ? "Copied!" : s.label}
                        </span>
                    </button>
                ))}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    );
}

function QrCanvas({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
    return (
        <div className="rounded-2xl overflow-hidden p-3 bg-white shadow-md border border-border">
            <canvas ref={canvasRef} />
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ShareDialog({
    open,
    onOpenChange,
    url,
    username,
    displayName,
    profile_picture,
    children,
}: ShareDialogProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("share");

    useEffect(() => {
        if (!open || activeTab !== "qr") return;
        let cancelled = false;

        async function render() {
            const QRCode = (await import("qrcode")).default;
            if (!cancelled && canvasRef.current) {
                await QRCode.toCanvas(canvasRef.current, url, {
                    width: 200,
                    margin: 2,
                    color: { dark: "#0f0f0f", light: "#ffffff" },
                });
            }
        }

        render();
        return () => { cancelled = true; };
    }, [open, activeTab, url]);

    // Reset tab when dialog closes
    useEffect(() => {
        if (!open) setActiveTab("share");
    }, [open]);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = async () => {
        const QRCode = (await import("qrcode")).default;
        const dataUrl = await QRCode.toDataURL(url, {
            width: 512,
            margin: 2,
            color: { dark: "#0f0f0f", light: "#ffffff" },
        });
        const a = document.createElement("a");
        a.download = `${username}-qr.png`;
        a.href = dataUrl;
        a.click();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {children}
            <DialogContent className="max-w-sm w-full rounded-3xl p-0 overflow-hidden gap-0 border-0 shadow-2xl">
                <DialogHeader className="px-5 pt-5 pb-0">
                    <DialogTitle className="text-center text-base font-semibold">
                        Share
                    </DialogTitle>
                </DialogHeader>

                <TabSwitcher active={activeTab} onChange={setActiveTab} />

                <div className="px-5 pb-5 pt-4">
                    {activeTab === "share" && (
                        <div className="flex flex-col w-full max-w-full overflow-hidden gap-4">
                            <ProfileCard
                                displayName={displayName}
                                username={username}
                                profile_picture={profile_picture}
                            />
                            <SocialGrid url={url} copied={copied} onCopy={handleCopy} />
                        </div>
                    )}

                    {activeTab === "qr" && (
                        <div className="flex flex-col items-center gap-4">


                            <QrCanvas canvasRef={canvasRef} />

                            <p className="text-xs text-muted-foreground text-center">
                                Scan to open this profile
                            </p>

                            <div className="flex gap-2 w-full">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopy}
                                    className="flex-1 rounded-2xl h-11 gap-2 text-xs font-medium"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? "Copied!" : "Copy link"}
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleDownload}
                                    className="flex-1 rounded-2xl h-11 gap-2 text-xs font-medium"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}