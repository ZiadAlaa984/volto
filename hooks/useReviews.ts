"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync, errorToast } from "@/lib/utils";
import { createReviewsApi } from "@/services/instances/ReviewsApi";
import { Review } from "@/types/business";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type NewReviewItem = Omit<Review, "id" | "created_at">;

export function useReviews(cardId?: string) {
    const { session } = useAuth();
    const api = createReviewsApi(session);
    const queryClient = useQueryClient();

    // GET all reviews for a card
    const {
        isLoading,
        data: reviewsData,
        error: getReviewsError,
    } = useQuery({
        queryKey: ["reviews", cardId],
        enabled: !!cardId,
        queryFn: catchAsync(async () => {
            return api.getAll({
                filters: { card_id: cardId } as any,
                skipUserFilter: true,
            });
        }),
    });

    // CREATE a review
    const {
        isPending: isCreating,
        mutateAsync: createReview,
        error: createReviewError,
    } = useMutation({
        mutationFn: catchAsync(async (review: NewReviewItem) => {
            return api.create(review);
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", cardId] });
        },
        onError: errorToast,
    });

    // DELETE a review by id
    const {
        isPending: isDeleting,
        mutateAsync: deleteReview,
        error: deleteReviewError,
    } = useMutation({
        mutationFn: catchAsync(async (reviewId: string) => {
            return api.delete(reviewId);
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reviews", cardId] });
        },
        onError: errorToast
    });

    return {
        reviewsData,
        createReview,
        deleteReview,
        isLoading,
        isPending: isCreating || isDeleting,
        error: createReviewError || deleteReviewError || getReviewsError,
    };
}