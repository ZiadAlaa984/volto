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

export type OpeningHours = {
    mon?: string; // "9:00-22:00" or "closed"
    tue?: string;
    wed?: string;
    thu?: string;
    fri?: string;
    sat?: string;
    sun?: string;
};