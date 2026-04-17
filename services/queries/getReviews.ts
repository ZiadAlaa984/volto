// services/queries/getReviews.ts
import { Review } from "@/types/business";
import { supabase } from "./getCardByUsername";

export async function getReviews(cardId: string) {
    const [{ data, error }, { data: stats, error: statsError }] = await Promise.all([
        supabase
            .from("reviews")
            .select("*, business_cards!inner(active_reviews)")
            .eq("card_id", cardId)
            .eq("business_cards.active_reviews", true)  // 👈 filter inactive
            .order("created_at", { ascending: false }),
        supabase.rpc("get_reviews_with_stats", { p_card_id: cardId }),
    ]);

    if (error || statsError) return { reviews: [], totalStars: 0, count: 0, averageRating: 0 };

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
