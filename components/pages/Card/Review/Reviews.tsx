"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TestimonialMarquee } from "@/components/ui/testimonial-marquee"
import { useReviews } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { PenLine, Star } from "lucide-react"
import { ReviewFormDialog, ReviewFormValues } from "./ReviewFormDialog"
import { ReviewsResult } from "@/services/queries/getReviews"

function RatingBar({ star, count, total }: { star: number; count: number; total: number }) {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-2 shrink-0">{star}</span>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                />
            </div>
            <span className="text-xs text-muted-foreground w-6 text-right shrink-0">{count}</span>
        </div>
    )
}

function ReviewsHeader({ reviews }: { reviews: ReviewsResult }) {
    // count per star
    const breakdown = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.reviews.filter((r) => Math.round(r.rating) === star).length,
    }))

    return (
        <div className="flex flex-col sm:flex-row items-start gap-6 px-4 md:px-6 py-5 border-b">
            {/* big score */}
            <div className="flex flex-col items-center justify-center min-w-[80px]">
                <span className="text-5xl font-bold tracking-tight">
                    {reviews.averageRating.toFixed(1)}
                </span>
                <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${s <= Math.round(reviews.averageRating)
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-muted text-muted"
                                }`}
                        />
                    ))}
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                    {reviews.count} review{reviews.count !== 1 ? "s" : ""}
                </span>
            </div>

            {/* bar breakdown */}
            <div className="flex flex-col gap-1.5 flex-1 w-full">
                {breakdown.map(({ star, count }) => (
                    <RatingBar key={star} star={star} count={count} total={reviews.count} />
                ))}
            </div>
        </div>
    )
}

function Reviews({
    reviews,
    cardId,
    activeReviews,
}: {
    reviews: ReviewsResult
    cardId: string
    activeReviews: boolean
}) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { createReview, isPending } = useReviews({ cardId, activeReviews })

    const handleSubmit = async (values: ReviewFormValues) => {
        await createReview({
            ...values,
            card_id: cardId,
            rating: values.rating as 1 | 2 | 3 | 4 | 5,
        })
        router.refresh()
    }

    return (
        <div className="w-full rounded-2xl border bg-card overflow-hidden">
            {reviews.reviews.length > 0 ? (
                <>
                    <ReviewsHeader reviews={reviews} />
                    <div className="py-4">
                        <TestimonialMarquee items={reviews.reviews} />
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center gap-2 py-12 px-6">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className="w-6 h-6 text-muted-foreground/30" />
                        ))}
                    </div>
                    <p className="text-sm font-medium">No reviews yet</p>
                    <p className="text-xs text-muted-foreground">Be the first to share your experience</p>
                </div>
            )}

            <div className="px-4 md:px-6 pb-5 pt-1">
                <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => setOpen(true)}
                    disabled={isPending}
                >
                    <PenLine className="h-4 w-4" />
                    Write a Review
                </Button>
            </div>

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