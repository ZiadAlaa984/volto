export interface Profile {
  id: string; // نفس auth.users.id
  user_name: string;
  name: string | null;
  bio: string | null;
  avatar: string | null;
  created_at: string;
}