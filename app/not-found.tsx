"use client";
import FuzzyText from "@/components/FuzzyText";
import { Heading1 } from "@/components/shared/Text";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function NotFound() {
    const { theme } = useTheme();

    const textColor = theme === "dark" ? "#ffffff" : "#000000";

    return (
        <div className=" min-h-screen flex flex-col items-center justify-center gap-6">
            <Heading1>Page Not Found</Heading1>
            <FuzzyText color={textColor} baseIntensity={0.2}>
                404
            </FuzzyText>
            <Link href="/" className="capitalize">
                <Button>Go to Home</Button>
            </Link>
        </div>
    );
}