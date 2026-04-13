import { supabase } from "@/lib/supabase/client";
import { APIClass } from "@/services/core/APIClass";
import { Review } from "@/types/business";
import { Session } from "@supabase/supabase-js";

// ── Type for your table ──────────────────────────────────────────────────────


// ── Factory — call this inside hooks/components after session is available ───
export const createReviewsApi = (session: Session | null) =>
  new APIClass<Review & Record<string, unknown>>("reviews", null, supabase);

