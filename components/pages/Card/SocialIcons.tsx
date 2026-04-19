"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getPlatform, platformAction, platformSubtitle } from "@/lib/social-platforms";
import { PlatformIcon } from "@/components/ui/platform-icon";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// ── Types ──────────────────────────────────────────────────────────────────

type Link = { url: string; platform: string };

// ── Animation variants ─────────────────────────────────────────────────────

const iconVariant = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    show: {
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
};


// ── Single icon ────────────────────────────────────────────────────────────

function SingleIcon({ link }: { link: Link }) {
    const platform = getPlatform(link.platform);
    const action = platformAction(link.platform, link.url);

    return (
        <motion.button
            title={platform.label}
            variants={iconVariant}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={action}
        >
            <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 rounded-2xl [&_svg]:w-7 [&_svg]:h-7"
                asChild={false}
            >
                <PlatformIcon name={platform.icon} />
            </Button>
        </motion.button>
    );
}

// ── Multi icon (same platform, 2+ links) ───────────────────────────────────

function MultiIcon({ platformKey, links }: { platformKey: string; links: Link[] }) {
    const [open, setOpen] = useState(false);
    const platform = getPlatform(platformKey);

    return (
        <>
            <motion.div
                variants={iconVariant}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="relative cursor-pointer"
                onClick={() => setOpen(true)}
                title={platform.label}
            >
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-12 h-12 rounded-2xl [&_svg]:w-7 [&_svg]:h-7"
                >
                    <PlatformIcon name={platform.icon} />
                </Button>

                {/* Count badge */}
                <span className="
                    absolute -top-1 -right-1 w-4 h-4 rounded-full
                    bg-primary text-primary-foreground
                    text-[9px] font-semibold
                    flex items-center justify-center pointer-events-none
                ">
                    {links.length}
                </span>
            </motion.div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-sm p-0 overflow-hidden gap-0">
                    <DialogHeader className="px-5 pt-5 pb-3">
                        <DialogTitle className="flex items-center gap-2 text-base">
                            <span className="[&_svg]:w-4 [&_svg]:h-4 text-muted-foreground">
                                <PlatformIcon name={platform.icon} />
                            </span>
                            {platform.label}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="px-4 pb-5 pt-1 flex flex-col gap-3">
                        {links.map((link, i) => {
                            const action = platformAction(link.platform, link.url);
                            const subtitle = platformSubtitle(link.platform, link.url);

                            return (
                                <button
                                    key={i}
                                    onClick={() => { action(); setOpen(false); }}
                                    className={`
                                        w-full flex items-center gap-3 p-3.5 rounded-xl border
                                       
                                        hover:brightness-95 active:scale-[0.98]
                                        transition-all duration-150 text-left
                                    `}
                                >
                                    <div className={`
                                        w-9 h-9 rounded-lg flex items-center justify-center
                                        bg-white/70  shrink-0 [&_svg]:w-4 [&_svg]:h-4
                                    `}>
                                        <PlatformIcon name={platform.icon} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium `}>
                                            {platform.label} {i + 1}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                                            {subtitle}
                                        </p>
                                    </div>
                                    <svg className={`w-3.5 h-3.5 shrink-0  opacity-50`} viewBox="0 0 16 16" fill="none">
                                        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            );
                        })}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function SocialIcons({ links }: { links: Link[] }) {
    if (!links.length) return null;

    // Group by platform key → one icon per platform
    const grouped = links.reduce<Record<string, Link[]>>((acc, link) => {
        (acc[link.platform] ??= []).push(link);
        return acc;
    }, {});

    return (
        <motion.div
            className="flex flex-row flex-wrap items-center justify-center gap-4 pt-1"
            initial="hidden"
            animate="show"
            variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } },
            }}
        >
            {Object.entries(grouped).map(([platformKey, platformLinks]) =>
                platformLinks.length === 1 ? (
                    <SingleIcon key={platformKey} link={platformLinks[0]} />
                ) : (
                    <MultiIcon key={platformKey} platformKey={platformKey} links={platformLinks} />
                )
            )}
        </motion.div>
    );
}