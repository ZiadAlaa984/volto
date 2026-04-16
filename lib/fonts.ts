import { Outfit, Geist_Mono, EB_Garamond, Cairo } from "next/font/google";

export const fontSans = Outfit({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const cairo = Cairo({
    subsets: ["latin"],
    variable: "--font-cairo",
});

export const garamond = EB_Garamond({
    subsets: ["latin"],
    weight: ["700"],
});