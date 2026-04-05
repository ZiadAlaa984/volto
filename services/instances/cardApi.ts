// services/instances/cardApi.ts
import { supabase as browserClient } from "@/lib/supabase/client";
import { APIClass } from "@/services/core/APIClass";
import { CardType } from "@/types/onboarding";
import { Session } from "@supabase/supabase-js";

type CardRecord = CardType & Record<string, unknown>;

// ── Client-side (hooks/mutations) ────────────────────────────────────────────
export const createCardApi = (session: Session | null) =>
  new APIClass<CardRecord>("cards", session, browserClient);
