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
import Router from "@/lib/route";
import { CardType } from "@/types/onboarding";
import { Badge } from "@/components/ui/badge";

type CardItem = {
    title: string;
    description: string;
    Action?: React.ReactNode;
    content?: React.ReactNode;
};

function SettingTab({ hasCard, isLoadingCard, cardData, deleteCard, isPending }: { hasCard: boolean; isLoadingCard: boolean; cardData: CardType; deleteCard: (card: any) => void; isPending: boolean }) {
    const { profileData, isLoading: isLoadingProfile } = useProfile();
    const { session } = useAuth();
    const router = useRouter();
    const { deleteAccount, isDeletingAccount } = useAccount();

    const cards = useMemo<CardItem[]>(() => [
        {
            title: "Account",
            description: "Manage your account",
            content: (
                <div>
                    {session === undefined ? <Skeleton className="h-4 w-20" /> : <p>Email: {session?.user?.email}</p>}
                    {isLoadingCard ? <Skeleton className="h-4 w-20" /> : hasCard && <p>
                        Profile URL{" "}:{" "}
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
            Action: <Badge variant="outline">
                {cardData?.card_type}
            </Badge>
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
                    onClick={() => deleteCard(cardData)}
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
                <Button onClick={() => router.push(Router.ONBOARDING)}>
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
            <div className="w-full space-y-6">
                <div className="grow space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
                <div className="grow space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/3" />
                </div>
                <div className="grow space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
                <div className="grow space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-1/2" />
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
                            {card.title && <CardTitle>{card.title}</CardTitle>}
                            {card.description && <CardDescription>{card.description}</CardDescription>}
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