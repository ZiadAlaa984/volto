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
import { useUpload } from "./useUpload";
import CARD_CREATION_STEPS from "@/lib/utils/steps";



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
  const [step, setStep] = useState<number>(CARD_CREATION_STEPS.IDLE);
  const { session } = useAuth();
  const userId = session?.user?.id;
  const api = createCardApi(session);
  const { updateProfile } = useProfile();
  const { createLinks } = useLinks();
  const { uploadFile } = useUpload();
  const createCard = useMutation({
    mutationFn: async (payload: CardType) => {
      if (!userId) return;
      setStep(CARD_CREATION_STEPS.IDLE);

      const { name, bio, user_name, links, profile_picture } = payload;

      setStep(CARD_CREATION_STEPS.SETTING_PROFILE);
      await updateProfile({ user_name });


      setStep(CARD_CREATION_STEPS.UPLOADING_PROFILE_PICTURE);
      const uploadedProfilePicture = await uploadFile(profile_picture as File);


      setStep(CARD_CREATION_STEPS.CREATING_CARD);
      const card = (await api.create({ user_id: userId, name, bio, profile_picture: uploadedProfilePicture })) as CardType;

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