"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Schema ───────────────────────────────────────────────────────────────────
const reviewSchema = z.object({
    customer_name: z.string().min(2, "Name must be at least 2 characters"),
    rating: z.number().min(1, "Please select a rating").max(5),
    review_text: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be under 500 characters"),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewFormDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (values: ReviewFormValues) => Promise<void>
    isPending: boolean
}

export function ReviewFormDialog({ open, onOpenChange, onSubmit, isPending }: ReviewFormDialogProps) {
    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            customer_name: "",
            rating: 1,
            review_text: "",
        },
    })

    const handleSubmit = async (values: ReviewFormValues) => {
        await onSubmit(values)
        form.reset()
        onOpenChange(false)
    }

    const watchedRating = form.watch("rating")

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl">Leave a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience. Your feedback helps others.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-5 pt-2">

                        {/* ── Name ── */}
                        <FormField
                            control={form.control}
                            name="customer_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ── Star Rating ── */}
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => field.onChange(star)}
                                                    className="transition-transform hover:scale-110 focus:outline-none"
                                                >
                                                    <Star
                                                        className={cn(
                                                            "h-8 w-8 transition-colors",
                                                            star <= (watchedRating ?? 0)
                                                                ? "fill-yellow-400 text-yellow-400"
                                                                : "fill-none text-muted-foreground"
                                                        )}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* ── Review Text ── */}
                        <FormField
                            control={form.control}
                            name="review_text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Review</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Tell us about your experience..."
                                            className="resize-none"
                                            rows={4}
                                            {...field}
                                        />
                                    </FormControl>
                                    <div className="flex justify-between items-center">
                                        <FormMessage />
                                        <span className="text-xs text-muted-foreground ml-auto">
                                            {field.value?.length ?? 0}/500
                                        </span>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-3 justify-end pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}