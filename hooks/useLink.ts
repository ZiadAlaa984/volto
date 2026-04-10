"use client";

import { useAuth } from "@/context/AuthContext";
import { LinkItemFormValues } from "@/lib/social-platforms";
import { catchAsync, toastShared } from "@/lib/utils";
import { createLinksApi } from "@/services/instances/LinksApi";
import { LinkItem } from "@/types/onboarding";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type NewLinkItem = Omit<LinkItem, "id" | "created_at">;

export function useLinks(cardId?: string) {
  const { session } = useAuth();
  const api = createLinksApi(session);
  const queryClient = useQueryClient();
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

  const {
    isLoading,
    data: linksData,
    error: getLinksError,
  } = useQuery({
    queryKey: ["links", cardId],
    enabled: !!cardId,
    queryFn: catchAsync(async () => {
      return api.getAll({
        filters: { card_id: cardId } as any,
        skipUserFilter: true,
      })
    }),
  });

  // useLinks.ts

  const {
    isPending: isSyncing,
    mutateAsync: syncLinks,
  } = useMutation({
    mutationFn: catchAsync(async (submittedLinks: LinkItemFormValues[]) => {
      const existingLinks = (linksData || []) as LinkItem[];

      // 1. DELETE — in DB but removed from form
      const submittedIds = new Set(
        submittedLinks.map((l) => l.id).filter(Boolean)
      );
      const toDelete = existingLinks.filter((l) => !submittedIds.has(l.id));
      await Promise.all(toDelete.map((l) => api.delete(l.id!)));

      // 2. UPDATE — have an id
      const toUpdate = submittedLinks
        .filter((l) => l.id)
        .map((l, i) => ({ ...l, order_num: i })) as LinkItem[];  // ← reflects current form order

      if (toUpdate.length) await api.bulkUpdate(toUpdate);

      // 3. CREATE — no id yet (new links)
      const toCreate = submittedLinks
        .filter((l) => !l.id)
        .map((l, i) => ({ ...l, card_id: cardId, order_num: existingLinks.length + i }));
      if (toCreate.length) await api.bulkCreate(toCreate);
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links", cardId] });
      toastShared({ title: "Links updated successfully" });
    },
    onError: (error) => {
      toastShared({ title: "Failed to update links", description: error.message });
    },
  });

  // return syncLinks instead of updateLinks
  return {
    linksData,
    syncLinks,       // ← renamed
    createLinks,
    isLoading,
    isPending: isCreating || isSyncing,
    error: createLinksError || getLinksError,
  };

}