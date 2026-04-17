'use client'

import MainContent from '@/components/pages/dashboard/MainContent'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'
import Router from '@/lib/route'
import BackComponent from '@/components/shared/BackComponent'
import { fadeUp } from '@/lib/animations'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCard } from '@/hooks/useCard'
import useBusinessInfo from '@/hooks/useBusinessInfo'
import { DEFAULT_HOURS } from '@/lib/Schema/InfoBusiness'
import { useRouter } from 'next/navigation'
import { catchAsync, toastShared } from '@/lib/utils'

function Page() {
    const router = useRouter()
    const { cardData, updateCardType, isPending: isCardPending } = useCard()
    const { createBusiness, isPending: isBusinessPending, businessData, isLoading } = useBusinessInfo(cardData?.id)

    const isPending = isCardPending || isBusinessPending

    const handleClick = catchAsync(async () => {
        if (!cardData) {
            toastShared({ title: "Create a card first", variant: "error" })
            return
        }

        if (!cardData.id) {
            toastShared({ title: "Card ID is required", variant: "error" })
            return
        }


        // Already has business — just navigate
        if (businessData) {
            router.push(Router.DASHBOARD.businessCard)
            return
        }

        // Update card type first, then create business regardless of stale cardData
        await updateCardType({ cardId: cardData.id, card_type: "business" })

        await createBusiness({
            card_id: cardData.id,
            opening_hours: DEFAULT_HOURS,
            locations: [],
            menu: null,
            video_url: '',
        })
    })


    return (
        <div className="min-h-screen flex flex-col gap-6">
            <BusinessCardBanner
                businessData={businessData}
                isPending={isPending}
                isLoading={isLoading}
                onClick={handleClick}
            />

            <BackComponent>
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </BackComponent>

            <MainContent />
        </div>
    )
}

// ─── Extracted sub-component ──────────────────────────────────────────────────

type BusinessCardBannerProps = {
    businessData: unknown
    isPending: boolean
    isLoading: boolean
    onClick: () => void
}

function BusinessCardBanner({ businessData, isPending, isLoading, onClick }: BusinessCardBannerProps) {
    const hasExisting = !!businessData

    return (
        <div className="group block">
            <Card className="relative overflow-hidden hover:border-border transition-colors">
                <MiniCardPreview />
                <CardContent className="pt-6 mt-8 md:mt-0 md:max-w-[60%]">
                    <Badge
                        {...fadeUp(0)}
                        variant="outline"
                        className="flex items-center mb-2 gap-2 justify-start w-fit"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        New
                    </Badge>

                    <h3 className="text-lg font-medium mb-1.5 capitalize">
                        {hasExisting ? 'View your business card' : 'Make your first business card'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                        {hasExisting
                            ? 'View your business card and manage your information.'
                            : 'Share who you are with one beautiful link — your bio, links, and identity in one place.'
                        }
                    </p>

                    <Button onClick={onClick} disabled={isPending || isLoading}>
                        {isPending ? 'Creating...' : hasExisting ? 'View Business' : 'Get started'}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}

function MiniCardPreview() {
    return (
        <div className="absolute top-4 right-10 w-[100px] h-[60px] rounded-lg border bg-muted/50 flex flex-col justify-between p-2.5 pointer-events-none">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-200" />
                <div className="h-1 rounded-full bg-border flex-1" />
            </div>
            <div className="flex flex-col gap-1">
                <div className="h-[3px] rounded-full bg-border/60 w-[90%]" />
                <div className="h-[3px] rounded-full bg-border/60 w-[60%]" />
            </div>
            <div className="flex gap-1">
                <div className="h-[3px] rounded-full bg-emerald-300 w-[30%]" />
                <div className="h-[3px] rounded-full bg-border/40 w-[25%]" />
            </div>
        </div>
    )
}

export default Page