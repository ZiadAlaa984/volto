"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TestimonialMarquee } from "@/components/ui/testimonial-marquee"
import { Review } from "@/types/business"
import { useReviews } from "@/hooks/useReviews"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"
import { ReviewFormDialog, ReviewFormValues } from "./ReviewFormDialog"

function Reviews({ reviews, cardId }: { reviews: Review[], cardId: string }) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const { createReview, isPending } = useReviews(cardId)

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
            {reviews.length > 0
                ? <TestimonialMarquee items={reviews} />
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