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
import { SOCIAL_LINKS } from "@/lib/Constant";
import { cn } from "@/lib/utils";

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