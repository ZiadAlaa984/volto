"use client"
import { useEffect, useMemo } from "react"
import { BriefcaseBusiness, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import GooeyTabs, { GooeyTab } from "@/components/shared/GooeyTabs"
import InfoBusinessTab from "./TabContent/InfoBusinessTab/InfoBusinessTab"
import ReviewsTab from "./TabContent/ReviewsTab/ReviewsTab"
import { useCard } from "@/hooks/useCard"
import useBusinessInfo from "@/hooks/useBusinessInfo"
import Router from "@/lib/route"
import { toastShared } from "@/lib/utils"

export default function MainContent() {
    const router = useRouter()
    const { cardData, isLoadingCard } = useCard()
    const { businessData, isLoading: isBusinessLoading, updateBusiness, isPending } = useBusinessInfo(cardData?.id)

    const isLoading = isLoadingCard || isBusinessLoading

    useEffect(() => {
        if (isLoading) return

        if (!businessData || !cardData) {
            toastShared({
                title: "Business or Card not found",
                description: "Please check your business or card data",
                variant: "error",
            })
            router.push(Router.DASHBOARD.home)
        }
    }, [isLoading, businessData, cardData, router])

    const tabs: GooeyTab[] = useMemo(() => [
        {
            slug: "info-card",
            title: "Info Business",
            icon: BriefcaseBusiness,
            content: <InfoBusinessTab businessData={businessData!} isLoading={isLoading} updateBusiness={updateBusiness} isPending={isPending} />,
        },
        {
            slug: "links",
            title: "Reviews",
            icon: MessageCircle,
            content: <ReviewsTab cardId={cardData?.id} />,
        },
    ], [cardData?.id])

    if (isLoading || !businessData || !cardData) return null

    return <GooeyTabs tabs={tabs} contentPadding="p-4 md:p-12" />
}