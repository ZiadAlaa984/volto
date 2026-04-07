"use client";

import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";

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
    if (!links.length) return null;

    return (
        <div className="w-full flex flex-col gap-3">
            {links.map((link, i) => (
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
    );
}