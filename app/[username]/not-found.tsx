// app/[slug]/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="space-y-2">
                    <h1 className="text-6xl font-bold text-foreground">404</h1>
                    <h2 className="text-2xl font-semibold text-foreground">
                        Card Not Found
                    </h2>
                    <p >
                        The card you're looking for doesn't exist or has been removed.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild>
                        <Link href="/">Go to Homepage</Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/protected/onboarding">Create Your Card</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}