export type BusinessCard = {
    id: string;
    card_id: string;
    menu_url: string | null;
    video_url: string | null;
    maps_url: string | null;
    address: string | null;
    opening_hours: OpeningHours | null;
    gallery: string[];
    renewal_day: number;
    status: 'active' | 'pending' | 'expired';
    created_at: string;
};

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