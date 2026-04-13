import { createClient } from "@supabase/supabase-js"
import { BusinessType } from "@/types/business"

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function getBusinessInfo(card_id: string): Promise<BusinessType | null> {
    const { data, error } = await supabase
        .from("business_cards")
        .select("*")
        .eq("card_id", card_id)
        .maybeSingle()

    if (error) throw new Error(error.message)
    return data as BusinessType | null
}