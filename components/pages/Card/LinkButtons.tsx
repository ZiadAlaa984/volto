"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlatformIcon } from "@/components/ui/platform-icon";
import CopyButton from "@/components/shared/CopyButton";

type Link = { url: string; title?: string; platform: string };

const fadeUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
    }),
};

export default function LinkButtons({ links }: { links: Link[] }) {
    console.log("🚀 ~ LinkButtons ~ links:", links)
    if (!links.length) return null;

    return (
        <div className="w-full flex flex-col gap-3">
            {links.map((link, i) => (
                <motion.div
                    key={i}
                    custom={i}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"

                    className="w-full flex items-center gap-2"
                >
                    {/* main link button */}

                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                    >
                        <Button
                            size="lg"
                            className="w-full flex items-center gap-3 justify-center"
                        >
                            <span className="truncate">{link.title || link.platform}</span>
                        </Button>
                    </a>

                    {/* copy — outside the <a> so it doesn't trigger navigation */}
                    <CopyButton url={link.url} />
                </motion.div>
            ))
            }
        </div >
    );
}