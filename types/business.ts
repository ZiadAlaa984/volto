import { Location } from "@/lib/Schema/InfoBusiness"

export type BusinessType = {
    id: string
    card_id: string;
    user_id: string;
    menu: {
        type: "text" | "file"
        value: string
    } | null,         // always a URL string in DB, File only during form editing
    video_url: string | null
    locations: Location[]
    opening_hours: OpeningHours | null
    renewal_day: number
    status: 'active' | 'pending' | 'expired'
    created_at: string
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