import { Location } from "@/lib/Schema/InfoBusiness"

// types/business.ts  (only the menu line changes)

// types/business.ts
export type MenuItemType = {
    type: "text" | "file"
    value: string
    label?: string
}

export type BusinessType = {
    id: string
    card_id: string;
    user_id: string;
    menu: MenuItemType[] | null   // ← was single object | null
    video_url: string | null
    locations: Location[]
    opening_hours: OpeningHours | null
    renewal_day: number
    status: 'active' | 'pending' | 'expired'
    created_at: string
    active_reviews: boolean
}

export type Review = {
    id: string;
    card_id: string;
    customer_name: string;
    rating: 1 | 2 | 3 | 4 | 5;
    review_text: string;
    created_at: string;
};


export type DayHours = {
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"
    closed: boolean
    open?: string  // "09:00" 24h
    close?: string // "18:00" 24h
}

export type OpeningHours = DayHours[]