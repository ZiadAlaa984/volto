"use client";

import { motion } from "framer-motion";

export default function CardFooter() {
    const origin =
        typeof window !== "undefined" ? window.location.origin : "https://volto.com";

    return (
        <motion.p
            className="text-xs pb-4 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
        >
            Create your own at{" "}
            <a
                href={origin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors font-medium hover:text-foreground"
            >
                Volto
            </a>
        </motion.p>
    );
}