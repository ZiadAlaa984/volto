"use client"
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

function page() {
    const router = useRouter()
    const { cardData } = useCard()
    const { createBusiness, isPending, businessData, isLoading } = useBusinessInfo(cardData?.id)

    async function onClick() {
        if (businessData) {
            // already exists — go to business card page
            router.push(Router.DASHBOARD.businessCard)
            return
        }

        await createBusiness({
            card_id: cardData?.id,
            opening_hours: DEFAULT_HOURS,
            locations: [],
            menu: null,
            video_url: '',
        })
    }

    return (
        <div className="min-h-screen flex flex-col gap-6">
            {cardData && (
                <div className="group block">
                    <Card className="relative overflow-hidden hover:border-border transition-colors">
                        {/* Decorative mini card preview */}
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

                        <CardContent className="pt-6 max-w-[60%]">
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
                                Make your first business card
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                Share who you are with one beautiful link — your bio, links, and identity in one place.
                            </p>

                            <Button
                                onClick={onClick}
                                disabled={isPending || isLoading}
                            >
                                {isPending
                                    ? 'Creating...'
                                    : businessData
                                        ? 'View Business'
                                        : 'Get started'
                                }
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}

            <BackComponent>
                <h1 className="text-2xl font-bold">Dashboard</h1>
            </BackComponent>

            <MainContent />
        </div>
    )
}

export default page