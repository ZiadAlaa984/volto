import { SupabaseClient } from "@supabase/supabase-js";
import { Session } from "@supabase/supabase-js";

export type QueryOptions<T> = {
  filters?: Partial<T>;
  orderBy?: { column: keyof T; ascending?: boolean };
  limit?: number;
  skipUserFilter?: boolean;
  pagination?: { page: number; pageSize?: number };  // ← add this
};

export class APIClass<T extends Record<string, unknown>> {
  private table: string;
  private supabase: SupabaseClient;
  private userId: string | null;

  constructor(
    table: string,
    session: Session | null,
    supabase: SupabaseClient,
  ) {
    this.table = table;
    this.supabase = supabase;
    this.userId = session?.user?.id ?? null;
  }

  // ── READ ALL ────────────────────────────────────────────────────────────────
  async getAll(options?: QueryOptions<T>): Promise<{ data: T[]; totalPages: number; currentPage: number }> {
    let query = this.supabase.from(this.table).select("*", { count: "exact" }); // ← count needed for totalPages

    if (this.userId && !options?.skipUserFilter) {
      query = query.eq("user_id", this.userId);
    }

    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined) query = query.eq(key, value);
      });
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column as string, {
        ascending: options.orderBy.ascending ?? true,
      });
    }

    // ── Pagination ──────────────────────────────────────────────────
    const pageSize = options?.pagination?.pageSize ?? 10;
    const page = options?.pagination?.page ?? 1;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);
    // ────────────────────────────────────────────────────────────────

    const { data, error, count } = await query;
    if (error) throw new Error(error.message);

    return {
      data: data as T[],
      currentPage: page,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    };
  }

  // ── READ ONE ────────────────────────────────────────────────────────────────
  async getById(id: string, column: keyof T | "user_id" = "id"): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select("*")
      .eq(column as string, id)
      .maybeSingle(); // ← returns null instead of throwing when 0 rows

    if (error) throw new Error(error.message);
    return data as T;
  }
  async bulkCreate(payload: Omit<T, "id" | "created_at">[]): Promise<T[]> {
    const cleaned = payload.map(({ id, created_at, ...rest }: any) => rest); // ← strip at runtime

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(cleaned)
      .select();

    if (error) throw new Error(error.message);
    return data as T[];
  }

  async deleteWhere(filters: Partial<T>): Promise<void> {
    let query = this.supabase.from(this.table).delete();
    Object.entries(filters).forEach(([key, value]) => {
      query = (query as any).eq(key, value);
    });
    const { error } = await query;
    if (error) throw new Error(error.message);
  }

  async bulkUpdate(payload: T[]): Promise<T[]> {
    const results = await Promise.all(
      payload.map(({ id, ...rest }) =>
        this.supabase
          .from(this.table)
          .update(rest)
          .eq("id", id as string)
          .select()
          .single()
          .then(({ data, error }) => {
            if (error) throw new Error(error.message);
            return data as T;
          })
      )
    );
    return results;
  }

  async create(payload: Omit<T, "id" | "created_at">): Promise<T> {
    const body = this.userId ? { ...payload, user_id: this.userId } : payload;

    const { data, error } = await this.supabase
      .from(this.table)
      .insert(body)
      .select()
      .single();

    if (error) {
      if (error.message.includes("cards_user_id_key")) {
        throw new Error("You already have a card");
      }

      if ((error as any).code === "23505") {
        throw new Error("Duplicate value not allowed");
      }

      // fallback
      throw new Error(error.message || "Failed to create record");
    }

    return data as T;
  }

  // ── UPDATE ──────────────────────────────────────────────────────────────────
  async update(
    id: string,
    payload: Partial<Omit<T, "id" | "created_at">>,
  ): Promise<T> {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as T;
  }

  // ── DELETE ──────────────────────────────────────────────────────────────────
  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
