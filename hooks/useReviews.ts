"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync, errorToast, toastShared } from "@/lib/utils";
import { createReviewsApi } from "@/services/instances/ReviewsApi";
import { Review } from "@/types/business";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type NewReviewItem = Omit<Review, "id" | "created_at">;

export function useReviews(cardId?: string, page: number = 1, onPageChange?: (page: number) => void) {
    const { session } = useAuth();
    const api = createReviewsApi(session);
    const queryClient = useQueryClient();

    // GET all reviews for a card
    const { isLoading, data: reviewsData, error: getReviewsError } = useQuery({
        queryKey: ["reviews", cardId, page],
        enabled: !!cardId,
        queryFn: catchAsync(async () => {
            return api.getAll({
                filters: { card_id: cardId } as any,
                skipUserFilter: true,
                pagination: { page, pageSize: 5 },
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
            toastShared({
                title: "Review created successfully",
                description: "The review has been created.",
            });

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
            const currentData = queryClient.getQueryData<typeof reviewsData>(["reviews", cardId, page]);
            const itemsOnPage = currentData?.data?.length ?? 0;

            if (itemsOnPage <= 1 && page > 1) {
                onPageChange?.(page - 1);
            }

            queryClient.invalidateQueries({ queryKey: ["reviews", cardId] });
            toastShared({
                title: "Review deleted successfully",
                description: "The review has been deleted.",
            });
        },
        onError: errorToast,
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