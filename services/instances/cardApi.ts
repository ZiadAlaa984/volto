import { supabase } from "@/lib/supabase/client";
import { APIClass } from "@/services/core/APIClass";
import { CardType } from "@/types/onboarding";
import { Session } from "@supabase/supabase-js";

// ── Type for your table ──────────────────────────────────────────────────────


// ── Factory — call this inside hooks/components after session is available ───
export const createCardApi = (session: Session | null) =>
  new APIClass<CardType & Record<string, unknown>>("cards", session, supabase);