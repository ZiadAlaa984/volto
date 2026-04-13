// services/instances/cardApi.ts
import { supabase as browserClient } from "@/lib/supabase/client";
import { APIClass } from "@/services/core/APIClass";
import { BusinessType } from "@/types/business";
import { Session } from "@supabase/supabase-js";

type BusinessRecord = BusinessType & Record<string, unknown>;

// ── Client-side (hooks/mutations) ────────────────────────────────────────────
export const createBuinessApi = (session: Session | null) =>
  new APIClass<BusinessRecord>("business_cards", session, browserClient);
