"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync } from "@/lib/utils";
import { createLinksApi } from "@/services/instances/LinksApi";
import { LinkItem } from "@/types/onboarding";
import { useMutation } from "@tanstack/react-query";

export function useLinks() {
  const { session } = useAuth();
  const api = createLinksApi(session);

  const {
    isPending: createPending,
    mutateAsync: create,
    error: createError,
  } = useMutation({
    mutationFn: catchAsync(async (linksData: Omit<LinkItem, "id" | "created_at">[]) => {
      if (!linksData?.length) return [];

      return await api.bulkCreate(linksData);
    }),
  });

  return {
    create,
    isPending: createPending,
    error: createError,
  };
}
