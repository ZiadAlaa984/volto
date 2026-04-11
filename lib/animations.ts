"use client"
import { Easing } from "framer-motion";

// Shared fade-up variant factory
export const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as unknown as Easing[], delay },
});