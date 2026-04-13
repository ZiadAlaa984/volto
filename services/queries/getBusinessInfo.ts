import { BusinessType } from "@/types/business"
import { supabase } from "./getCardByUsername"


export async function getBusinessInfo(card_id: string): Promise<BusinessType | null> {
    const { data, error } = await supabase
        .from("business_cards")
        .select("*")
        .eq("card_id", card_id)
        .maybeSingle()

    if (error) throw new Error(error.message)
    return data as BusinessType | null
}