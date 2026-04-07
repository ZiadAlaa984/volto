"use client";

import FuzzyText from "@/components/FuzzyText";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <FuzzyText fontSize="clamp(1rem, 2vw, 2rem)">Something went wrong!</FuzzyText>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}