"use client";

import { useAuth } from "@/context/AuthContext";
import { toastShared } from "@/lib/utils";
import { createCardApi } from "@/services/instances/cardApi";
import { CardType } from "@/types/onboarding";
import { useMutation } from "@tanstack/react-query";
import { useProfile } from "./useProfile";
import { useLinks } from "./useLink";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CARD_CREATION_STEPS = {
  IDLE: 0,
  SETTING_PROFILE: 0,
  CREATING_CARD: 1,
  CREATING_LINKS: 2,
  DONE: 3,
} as const;

const ERROR_MESSAGES = {
  DUPLICATE_CARD: "You already have a card",
  DEFAULT: "Failed to create card",
} as const;

function getErrorMessage(error: Error): string {
  return error.message.includes("cards_user_id_key")
    ? ERROR_MESSAGES.DUPLICATE_CARD
    : ERROR_MESSAGES.DEFAULT;
}

export function useCard() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2 | 3>(CARD_CREATION_STEPS.IDLE);
  const { session } = useAuth();
  const userId = session?.user?.id;
  const api = createCardApi(session);
  const { updateProfile } = useProfile();
  const { createLinks } = useLinks();

  const createCard = useMutation({
    mutationFn: async (payload: CardType) => {
      if (!userId) return;

      const { name, bio, user_name, links } = payload;

      setStep(CARD_CREATION_STEPS.SETTING_PROFILE);
      await updateProfile({ user_name });

      setStep(CARD_CREATION_STEPS.CREATING_CARD);
      const card = (await api.create({ user_id: userId, name, bio })) as CardType;

      if (links?.length) {
        setStep(CARD_CREATION_STEPS.CREATING_LINKS);
        await createLinks(
          links.map((link, index) => ({
            ...link,
            card_id: card.id,
            order_num: index + 1,
          })),
        );
      }

      setStep(CARD_CREATION_STEPS.DONE);
      return user_name;
    },
    onSuccess: (username) => {
      if (!username) return;
      toastShared({
        title: "Card created successfully",
        description: "Redirecting you to your card page...",
      });
      router.push(`/${username}`);
    },
    onError: (error: Error) => {
      toastShared({
        title: "Something went wrong",
        description: getErrorMessage(error),
        variant: "error",
      });
      setStep(CARD_CREATION_STEPS.IDLE);
    },
  });

  const checkHasCard = async (userId: string) => {
    if (!userId) return;
    const card = await api.getById(userId, "user_id");
    if (card) router.push("./dashboard");
  };
  return {
    createCard: createCard.mutateAsync,
    checkHasCard,
    isLoading: createCard.isPending,
    error: createCard.error ?? null,
    step,
  };
}