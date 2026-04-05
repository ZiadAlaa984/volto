// services/instances/profileApi.ts
import { supabase } from "@/lib/supabase/client";
import { APIClass } from "@/services/core/APIClass";
import { Profile } from "@/types/profile";
import { Session } from "@supabase/supabase-js";

// Client-side only — no server imports, no next/headers
export const createProfileApi = (session: Session | null) =>
  new APIClass<Profile & Record<string, unknown>>("profiles", session, supabase);