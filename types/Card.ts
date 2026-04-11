export interface Card {
  id: string;
  user_id: string;
  name: string;
  bio: string;
  created_at: string;
  profile_picture: string;
  card_type: 'business' | 'personal';
}