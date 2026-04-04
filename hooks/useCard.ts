"use client"
import { useAuth } from "@/context/AuthContext";
import { toastShared } from "@/lib/utils";
import { createCardApi } from "@/services/instances/cardApi";
import { CardType } from "@/types/onboarding";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "./useProfile";
import { useLinks } from "./useLink";
import { useState } from "react";
import { useRouter } from "next/navigation";

// ── Query Keys ───────────────────────────────────────────────────────────────
export const cardKeys = {
  all: ["cards"] as const,
  list: (filters?: object) => ["cards", "list", filters] as const,
  detail: (id: string) => ["cards", "detail", id] as const,
};

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useCard(id?: string) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { session } = useAuth();
  const user_id = session?.user?.id;
  const queryClient = useQueryClient();
  const api = createCardApi(session);
  const { update: updateProfile } = useProfile();
  const { create: createLinks } = useLinks();

  // ── CREATE ─────────────────────────────────────────────────────────────────
  const create = useMutation({
    mutationFn: (async (payload: CardType) => {
      if (!user_id) return;
      setLoading(true)

      const { name, bio, user_name, links } = payload;

      setStep(0); // Setting profile
      await updateProfile({ user_name });

      setStep(1); // Creating card
      const card = (await api.create({ user_id, name, bio })) as CardType;

      setStep(2); // Creating links
      console.log("🚀 ~ useCard ~ links:", links);
      if (links?.length) {
        await createLinks(
          links.map((link, i) => ({
            ...link,
            card_id: card.id, // now string ✅
            order_num: i + 1,
          })),
        );
      }
      setStep(3); // Done

      setLoading(false);

      return user_name;
    }),
    onSuccess: (user_name) => {
      if (!user_name) return;
      toastShared({
        title: "Card created successfully",
        description: "Redirecting you to your card page...",
      });
      router.push(`/${user_name}`);
    },
    onError: (error: Error) => {
      toastShared({
        title: "Something went wrong",
        description: error.message.includes("cards_user_id_key")
          ? "You already have a card"
          : "Failed to create card",
      });
      setLoading(false);
      setStep(0);
    },
  });
  const checkHaveCard = async (user_id: string) => {
    const currentUserId = user_id;

    console.log("user_id:", currentUserId);

    if (!currentUserId) return;

    const card = await api.getById(currentUserId);
    if (card) {
      router.push(`./dashboard`);
    }
  };

  // ── Unified loading / error states ────────────────────────────────────────
  const isLoading = create.isPending;

  const error = create.error ?? null;

  return {
    createAsync: create.mutateAsync,
    states: {
      create: {
        isLoading: loading || create.isPending,
        error: create.error,
        isSuccess: create.isSuccess,
      },
    },

    // top-level convenience
    isLoading,
    error,
    step,
    checkHaveCard,
    // cache utils
    invalidate: () => queryClient.invalidateQueries({ queryKey: cardKeys.all }),
    prefetch: (id: string) =>
      queryClient.prefetchQuery({
        queryKey: cardKeys.detail(id),
        queryFn: () => api.getById(id),
      }),
  };
}

