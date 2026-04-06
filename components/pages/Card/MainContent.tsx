"use client";

import { useState } from "react";
import { motion, Variants } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CardType } from "@/types/onboarding";
import { SOCIAL_PLATFORMS } from "@/lib/social-platforms";
import { PlatformIcon } from "@/components/ui/platform-icon";
import QrCodeModal from "./QrCodeModal";
import { QrCode } from "lucide-react";

const SOCIAL_KEYS = [
    "facebook", "instagram", "twitter", "linkedin",
    "youtube", "tiktok", "github", "snapchat", "pinterest",
];

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

const cardVariant = {
    hidden: { opacity: 0, scale: 0.96, y: 24 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function MainContent({ CardData }: { CardData: CardType }) {
    const [qrOpen, setQrOpen] = useState(false);

    const socialLinks = CardData?.links ?? [];
    const socialMedia = socialLinks.filter((l) => SOCIAL_KEYS.includes(l.platform));
    const otherLinks = socialLinks.filter((l) => !SOCIAL_KEYS.includes(l.platform));

    const profileUrl =
        typeof window !== "undefined"
            ? window.location.href
            : `https://volto.com/${CardData?.user_name ?? ""}`;

    const initials = CardData?.name
        ? CardData.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
        : "?";

    return (
        <>
            <motion.div
                variants={cardVariant}
                initial="hidden"
                animate="show"
                className="flex justify-center items-start w-full"
            >
                <Card className="max-w-[380px] w-full flex items-start justify-center py-12 px-4">
                    <div className="w-full flex flex-col items-center gap-6">

                        {/* ── Avatar + name + bio ── */}
                        <CardHeader className="flex flex-col items-center gap-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.7 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] as const }}
                            >
                                <Avatar className="w-[120px] h-[120px] shadow-xl">
                                    <AvatarImage
                                        src={CardData?.profile_picture as string || ""}
                                        className="object-contain"
                                        alt={CardData?.name}
                                    />
                                    <AvatarFallback className="text-2xl font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </motion.div>

                            <motion.div
                                className="text-center space-y-1"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                            >
                                <h1 className="text-2xl font-bold tracking-tight">
                                    {CardData?.name ?? "Your Name"}
                                </h1>
                                {CardData?.bio && (
                                    <p className="text-xl leading-snug text-muted-foreground">
                                        {CardData.bio}
                                    </p>
                                )}
                            </motion.div>
                        </CardHeader>

                        {/* ── Link buttons ── */}
                        {otherLinks.length > 0 && (
                            <div className="w-full flex flex-col gap-3">
                                {otherLinks.map((link, i) => (
                                    <motion.a
                                        key={i}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full"
                                        custom={i}
                                        variants={fadeUp}
                                        initial="hidden"
                                        animate="show"
                                        whileHover={{ scale: 1.025 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <Button size="lg" className="w-full">
                                            {link.title || link.platform}
                                        </Button>
                                    </motion.a>
                                ))}
                            </div>
                        )}

                        {/* ── Social icons ── */}
                        {socialMedia.length > 0 && (
                            <motion.div
                                className="flex flex-row flex-wrap items-center justify-center gap-4 pt-1"
                                initial="hidden"
                                animate="show"
                                variants={{
                                    hidden: {},
                                    show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
                                }}
                            >
                                {socialMedia.map((link, i) => {
                                    const platform = SOCIAL_PLATFORMS?.find((p) => p.key === link.platform);
                                    return (
                                        <motion.a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={link.platform}
                                            variants={{
                                                hidden: { opacity: 0, scale: 0.5, y: 10 },
                                                show: {
                                                    opacity: 1, scale: 1, y: 0,
                                                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
                                                },
                                            }}
                                            whileHover={{ scale: 1.2, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-12 h-12 rounded-2xl [&_svg]:w-7 [&_svg]:h-7"
                                            >
                                                <PlatformIcon name={platform?.icon || ""} />
                                            </Button>
                                        </motion.a>
                                    );
                                })}
                            </motion.div>
                        )}

                        {/* ── QR Code trigger ── */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.4 }}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                        >
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setQrOpen(true)}
                                className="gap-2 rounded-xl text-xs font-medium transition-all"
                            >
                                <QrCode className="w-3.5 h-3.5" />
                                Show QR code
                            </Button>
                        </motion.div>

                        {/* ── Footer ── */}
                        <motion.p
                            className="text-xs pb-4 text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.4 }}
                        >
                            Create your own at{" "}
                            <a
                                href={typeof window !== "undefined" ? window.location.origin : "https://volto.com"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-colors font-medium hover:text-foreground"
                            >
                                Volto
                            </a>
                        </motion.p>

                    </div>
                </Card>
            </motion.div>

            <QrCodeModal
                open={qrOpen}
                onOpenChange={setQrOpen}
                url={profileUrl}
                username={CardData?.user_name ?? "user"}
            />
        </>
    );
}