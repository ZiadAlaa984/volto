import { notFound } from "next/navigation"; // ✅ import this
import { CardType, LinkItem } from "@/types/onboarding";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCardByUsername(username: string): Promise<CardType> {
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_name", username)
        .maybeSingle();

    if (profileError) throw new Error(profileError.message);
    if (!profile) notFound(); // ✅ this throws internally, stops execution

    const { data: card, error: cardError } = await supabase
        .from("cards")
        .select(`
            *,
            links (
                title,
                url,
                platform,
                card_id,
                order_num
            )
        `)
        .eq("user_id", profile.id)
        .order("order_num", { ascending: true, referencedTable: "links" })
        .maybeSingle();

    if (cardError) throw new Error(cardError.message);
    if (!card) notFound(); // ✅

    const { links, ...cardData } = card;

    return { ...cardData, links: (links as LinkItem[]) ?? [] } as CardType;
}