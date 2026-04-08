"use client";

import AlertDialogShared from "@/components/shared/AlertDialogShared";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useCard } from "@/hooks/useCard";
import { useProfile } from "@/hooks/useProfile";
import { useAccount } from "@/hooks/useAccount";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type CardItem = {
    title: string;
    description: string;
    Action?: React.ReactNode;
    content?: React.ReactNode;
};

function SettingTab() {
    const { profileData, isLoading: isLoadingProfile } = useProfile();
    const { deleteAccount, isDeletingAccount } = useAccount();
    const { session } = useAuth();
    const { deleteCard, isPending, hasCard, cardData, isLoadingCard } = useCard();
    const router = useRouter();

    const cards = useMemo<CardItem[]>(() => [
        {
            title: "Profile",
            description: "Update your profile information",
            content: (
                <div>
                    {session === undefined ? <Skeleton className="h-4 w-20" /> : <p>Email: {session?.user?.email}</p>}
                    {isLoadingCard ? <Skeleton className="h-4 w-20" /> : hasCard && <p>
                        Username:{" "}
                        <Link
                            target="_blank"
                            className="underline font-light italic"
                            href={`/${profileData?.user_name}`}
                        >
                            {profileData?.user_name}
                        </Link>
                    </p>}

                </div>
            ),
        },
        {
            title: "Theme",
            description: "Change your theme",
            Action: <ThemeSwitcher />,
        },
        ...(hasCard && cardData?.id ? [{
            title: "Delete Card",
            description: "Delete your card",
            Action: (
                <AlertDialogShared
                    onClick={() => deleteCard(cardData.id!)}
                    disabled={isPending}
                    title="Delete Card"
                    description="Are you sure you want to delete your card?"
                    actionText="Delete Card"
                />
            ),
        }] : [{
            title: "Create Card",
            description: "Create your card",
            Action: (
                <Button onClick={() => router.push("/protected/onboarding")}>
                    Create Card
                </Button>
            ),
        }]),
        {
            title: "Delete Account",
            description: "Delete your account",
            Action: (
                <AlertDialogShared
                    onClick={deleteAccount}
                    disabled={isDeletingAccount}
                    title="Delete Account"
                    description="Are you sure you want to delete your account?"
                    actionText="Delete Account"
                />
            ),
        },
    ], [profileData, session, hasCard, cardData, isPending, deleteAccount, isDeletingAccount]);

    if (isLoadingProfile || isLoadingCard) {
        return (
            <div className="flex flex-col space-y-3">
                <Skeleton className="h-[125px] w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            {cards.map((card, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>{card.title}</CardTitle>
                            <CardDescription>{card.description}</CardDescription>
                        </div>
                        {card.Action && card.Action}
                    </CardHeader>
                    {card.content && <CardContent>{card.content}</CardContent>}
                </Card>
            ))}
        </div>
    );
}

export default SettingTab;