"use client";

import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, QrCode, Copy, Check } from "lucide-react";

interface QrCodeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    url: string;
    username: string;
}

export default function QrCodeModal({ open, onOpenChange, url, username }: QrCodeModalProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;

        async function render() {
            const QRCode = (await import("qrcode")).default;
            if (!cancelled && canvasRef.current) {
                await QRCode.toCanvas(canvasRef.current, url, {
                    width: 220,
                    margin: 2,
                    color: { dark: "#0f0f0f", light: "#ffffff" },
                });
            }
        }
        render();
        return () => { cancelled = true; };
    }, [open, url]);

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

    const handleCopy = async () => {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xs w-full rounded-3xl p-6 flex flex-col items-center gap-5">
                <DialogHeader className="items-center gap-1 w-full">
                    <div className="w-10 h-10 rounded-2xl  flex items-center justify-center mb-1">
                        <QrCode className="w-5 h-5 " />
                    </div>
                    <DialogTitle className=" text-base font-semibold">Scan to visit</DialogTitle>
                    <p className="/40 text-xs text-center truncate w-full px-2">{url}</p>
                </DialogHeader>

                <div className="rounded-2xl overflow-hidden p-3 shadow-lg">
                    <canvas ref={canvasRef} />
                </div>

                <div className="flex gap-2 w-full">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="flex-1 rounded-xl h-10 gap-2  text-xs font-medium"
                    >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied!" : "Copy link"}
                    </Button>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={handleDownload}
                        className="flex-1 rounded-xl h-10 gap-2  text-xs font-medium"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Download
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}