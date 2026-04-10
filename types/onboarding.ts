// ─── Shared form data ─────────────────────────────────────────────────────────

export interface LinkItem {
  title: string;
  id?: string;
  url: string;
  platform: string;
  card_id?: string;
  order_num?: number;
  [key: string]: unknown;
}

export interface CardType {
  user_name: string;
  profile_picture: File | null | string;
  name: string;
  bio: string;
  links: LinkItem[];
  user_id?: string
  id?: string
}



// ─── Every step gets these props ──────────────────────────────────────────────

export interface StepProps {
  formData: CardType;
  onNext: (data?: Partial<CardType>) => void;
  onBack: () => void;
  onFinish?: boolean;
}