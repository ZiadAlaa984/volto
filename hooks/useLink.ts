"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync } from "@/lib/utils";
import { createLinksApi } from "@/services/instances/LinksApi";
import { LinkItem } from "@/types/onboarding";
import { useMutation } from "@tanstack/react-query";

type NewLinkItem = Omit<LinkItem, "id" | "created_at">;

export function useLinks() {
  const { session } = useAuth();
  const api = createLinksApi(session);

  const {
    isPending: isCreating,
    mutateAsync: createLinks,
    error: createLinksError,
  } = useMutation({
    mutationFn: catchAsync(async (links: NewLinkItem[]) => {
      if (!links?.length) return [];
      return api.bulkCreate(links);
    }),
  });

  return {
    createLinks,
    isPending: isCreating,
    error: createLinksError,
  };
}