// services/queries/getReviews.ts
import { Review } from "@/types/business";
import { supabase } from "./getCardByUsername";

export async function getReviews(cardId: string) {
    const [{ data, error }, { data: stats, error: statsError }] = await Promise.all([
        supabase
            .from("reviews")
            .select("*")
            .eq("card_id", cardId)
            .order("created_at", { ascending: false }),
        supabase.rpc("get_reviews_with_stats", { p_card_id: cardId }),
    ]);

    if (error) return { reviews: [], totalStars: 0, count: 0, averageRating: 0 };

    const totalStars = Number(stats?.totalStars ?? 0);
    const count = Number(stats?.count ?? 0);
    const averageRating = Number(stats?.averageRating ?? 0);

    return {
        reviews: (data as Review[]) ?? [],
        totalStars,
        count,
        averageRating,
    };
}

export type ReviewsResult = {
    reviews: Review[];
    totalStars: number;
    count: number;
    averageRating: number;
};