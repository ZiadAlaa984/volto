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
      const toInsert = submittedLinks.map((l, i) => ({
        ...l,
        card_id: cardId,
        order_num: i,
      }));
      // delete first, then create
      await api.deleteWhere({ card_id: cardId } as any);
      await api.bulkCreate(toInsert);
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