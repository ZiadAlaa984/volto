import { supabase } from "@/lib/supabase/client";
import { APIClass } from "@/services/core/APIClass";
import { LinkItem } from "@/types/onboarding";
import { Session } from "@supabase/supabase-js";

// ── Type for your table ──────────────────────────────────────────────────────


// ── Factory — call this inside hooks/components after session is available ───
export const createLinksApi = (session: Session | null) =>
  new APIClass<LinkItem & Record<string, unknown>>("links", session, supabase);

