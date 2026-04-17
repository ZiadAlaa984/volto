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
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function MainContent() {
    const router = useRouter()
    const { cardData, isLoadingCard } = useCard()
    const { businessData, isLoading: isBusinessLoading, updateBusiness, isPending, isTogglingReviews, toggleActiveReviews } =
        useBusinessInfo(cardData?.id, cardData)

    const isLoading = isLoadingCard || (!!cardData?.id && isBusinessLoading)

    useEffect(() => {
        // ✅ Always wait for loading to finish first
        if (isLoading) return

        // ✅ Only redirect after we're sure data isn't coming
        if (!businessData || !cardData) {
            toastShared({
                title: "Business or Card not found",
                description: "Please check your business or card data",
                variant: "error",
            })
            router.push(Router.DASHBOARD.home)
        }
    }, [isLoading, businessData, cardData, router])

    // ✅ All used values included in deps
    const tabs: GooeyTab[] = useMemo(() => [
        {
            slug: "info-card",
            title: "Info Business",
            icon: BriefcaseBusiness,
            content: (
                <InfoBusinessTab
                    businessData={businessData!}
                    isLoading={isLoading}
                    updateBusiness={updateBusiness}
                    isPending={isPending}
                />
            ),
        },
        {
            slug: "links",
            title: "Reviews",
            icon: MessageCircle,
            content: (
                <div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="reviews"
                                checked={businessData?.active_reviews ?? false}
                                disabled={isTogglingReviews}
                                onCheckedChange={(checked) => toggleActiveReviews(checked)}
                            />
                            <Label htmlFor="reviews">Active Reviews</Label>
                        </div>
                    </div>
                    {
                        businessData?.active_reviews && (
                            <ReviewsTab activeReviews={businessData?.active_reviews ?? false} cardId={cardData?.id} />
                        )
                    }
                </div>
            ),
        },
    ], [cardData?.id, businessData, isLoading, updateBusiness, isPending, isTogglingReviews, toggleActiveReviews])

    if (isLoading || !businessData || !cardData) return null

    return <GooeyTabs tabs={tabs} contentPadding="p-4 md:p-12" />
}