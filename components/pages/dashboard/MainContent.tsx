"use client"
import { useMemo } from "react"
import { CreditCard, Link, Settings } from "lucide-react"
import GooeyTabs, { GooeyTab } from "@/components/shared/GooeyTabs"
import SettingTab from "./TabsContent/Setting/SettingTab"
import InfoCardTab from "./TabsContent/InfoCard/InfoCardTab"
import LinksTab from "./TabsContent/Links/LinksTab"
import { useCard } from "@/hooks/useCard"
import { CardType } from "@/types/onboarding"

export default function GooeyDemo() {
    const { deleteCard, isPending, hasCard, cardData, isLoadingCard, updateCard } = useCard()




    const tabs: GooeyTab[] = useMemo(() => [
        {
            slug: "info-card",
            title: "Info Card",
            icon: CreditCard,
            content: (
                <InfoCardTab
                    cardData={cardData as CardType}
                    isLoadingCard={isLoadingCard}
                    isUpdating={isPending}
                    updateCard={updateCard}
                />
            ),
        },
        ...(cardData?.id
            ? [{
                slug: "links",
                title: "Links",
                icon: Link,
                content: <LinksTab cardId={cardData.id} />,
            }]
            : []),
        {
            slug: "settings",
            title: "Settings",
            icon: Settings,
            content: (
                <SettingTab
                    hasCard={hasCard}
                    isLoadingCard={isLoadingCard}
                    cardData={cardData as CardType}
                    deleteCard={deleteCard}
                    isPending={isPending}
                />
            ),
        },
    ], [cardData, hasCard, isLoadingCard, deleteCard, isPending, updateCard])

    return <GooeyTabs tabs={tabs} />
}