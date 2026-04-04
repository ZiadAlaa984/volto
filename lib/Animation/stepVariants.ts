// ─── Animation ────────────────────────────────────────────────────────────────

import { Variants } from "framer-motion";

export const fadeInUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay } },
});

export const stepVariants: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.28, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -40, transition: { duration: 0.2, ease: "easeIn" } },
};