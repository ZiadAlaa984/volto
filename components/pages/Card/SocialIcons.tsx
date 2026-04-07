"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SOCIAL_PLATFORMS } from "@/lib/social-platforms";
import { PlatformIcon } from "@/components/ui/platform-icon";

type Link = { url: string; platform: string };

const iconVariant = {
    hidden: { opacity: 0, scale: 0.5, y: 10 },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function SocialIcons({ links }: { links: Link[] }) {
    if (!links.length) return null;

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
            {links.map((link, i) => {
                const platform = SOCIAL_PLATFORMS?.find((p) => p.key === link.platform);
                return (
                    <motion.a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.platform}
                        variants={iconVariant}
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
    );
}