"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TestimonialMarquee } from "@/components/ui/testimonial-marquee"
import { useReviews } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import { ReviewFormDialog, ReviewFormValues } from "./ReviewFormDialog"
import { ReviewsResult } from "@/services/queries/getReviews"

function Reviews({ reviews, cardId, activeReviews }: { reviews: ReviewsResult, cardId: string, activeReviews: boolean }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { createReview, isPending } = useReviews({
        cardId,
        activeReviews: activeReviews
    })

    const handleSubmit = async (values: ReviewFormValues) => {
        await createReview({
            ...values,
            card_id: cardId,
            rating: values.rating as 1 | 2 | 3 | 4 | 5
        })
        router.refresh()
    }

    return (
        <div className="flex flex-col w-full gap-6">
            {reviews.reviews.length > 0
                ? <>
                    <div>
                        <h2 className="text-xl font-semibold">
                            Reviews
                        </h2>
                        <div>
                            <span>
                                {reviews.averageRating.toFixed(1)} ({reviews.count} reviews)
                            </span>
                        </div>
                    </div>
                    <TestimonialMarquee items={reviews.reviews} />
                </>
                : (
                    <p className="text-center text-sm text-muted-foreground py-8">
                        No reviews yet. Be the first!
                    </p>
                )
            }

            <Button size="lg" onClick={() => setOpen(true)} disabled={isPending}>
                <PenLine className="h-4 w-4" />
                Write a Review
            </Button>

            <ReviewFormDialog
                open={open}
                onOpenChange={setOpen}
                onSubmit={handleSubmit}
                isPending={isPending}
            />
        </div>
    )
}

export default Reviews