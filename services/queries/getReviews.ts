// services/queries/getReviews.ts

import { supabase } from "./getCardByUsername";

export async function getReviews(cardId: string) {
    const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("card_id", cardId)
        .order("created_at", { ascending: false });

    if (error) return [];
    return data;
}