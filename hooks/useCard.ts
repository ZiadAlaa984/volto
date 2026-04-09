"use client";

import { useAuth } from "@/context/AuthContext";
import { toastShared } from "@/lib/utils";
import { createCardApi } from "@/services/instances/cardApi";
import { CardType } from "@/types/onboarding";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "./useProfile";
import { useLinks } from "./useLink";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUpload } from "./useUpload";
import CARD_CREATION_STEPS from "@/lib/utils/steps";
import { Card } from "@/lib/Schema/CardInfoSchema";

// ─── Constants ───────────────────────────────────────────────────────────────

const ERROR_MESSAGES = {
  DUPLICATE_CARD: "You already have a card",
  DEFAULT: "Failed to create card",
} as const;

function getErrorMessage(error: Error): string {
  return error.message.includes("cards_user_id_key")
    ? ERROR_MESSAGES.DUPLICATE_CARD
    : ERROR_MESSAGES.DEFAULT;
}

// ─── Sub-hooks ────────────────────────────────────────────────────────────────

function useCardStep() {
  const [step, setStep] = useState<number>(CARD_CREATION_STEPS.IDLE);
  const reset = () => setStep(CARD_CREATION_STEPS.IDLE);
  return { step, setStep, reset };
}

function useCardApi() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const api = createCardApi(session);
  return { api, userId, session };
}

function useCardQuery(userId: string | undefined, api: ReturnType<typeof createCardApi>) {
  return useQuery({
    queryKey: ["card", userId],
    queryFn: async () => {
      if (!userId) return null;
      try {
        const card = await api.getById(userId, "user_id");
        return card ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!userId,
  });
}

function useCreateCardMutation({
  userId,
  api,
  setStep,
  updateProfile,
  uploadFile,
  createLinks,
}: {
  userId: string | undefined;
  api: ReturnType<typeof createCardApi>;
  setStep: (step: number) => void;
  updateProfile: ReturnType<typeof useProfile>["updateProfile"];
  uploadFile: ReturnType<typeof useUpload>["uploadFile"];
  createLinks: ReturnType<typeof useLinks>["createLinks"];
}) {
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: CardType) => {
      if (!userId) return;

      const { name, bio, user_name, links, profile_picture } = payload;

      setStep(CARD_CREATION_STEPS.SETTING_PROFILE);
      await updateProfile({ user_name });

      setStep(CARD_CREATION_STEPS.UPLOADING_PROFILE_PICTURE);
      const uploadedProfilePicture = await uploadFile(profile_picture as File);

      setStep(CARD_CREATION_STEPS.CREATING_CARD);
      const card = (await api.create({
        user_id: userId,
        name,
        bio,
        profile_picture: uploadedProfilePicture,
      })) as CardType;

      if (links?.length) {
        setStep(CARD_CREATION_STEPS.CREATING_LINKS);
        await createLinks(
          links.map((link, index) => ({
            ...link,
            card_id: card.id,
            order_num: index + 1,
          }))
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
}

function useDeleteCardMutation(userId: string | undefined, api: ReturnType<typeof createCardApi>) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cardId: string) => {
      if (!cardId) return;
      await api.delete(cardId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", userId] });
      toastShared({ title: "Card deleted successfully" });
      router.refresh();
    },
    onError: (error: Error) => {
      toastShared({
        title: "Something went wrong",
        description: getErrorMessage(error),
        variant: "error",
      });
    },
  });
}

// ─── Update Card Mutation ─────────────────────────────────────────────────────

function useUpdateCardMutation(
  userId: string | undefined,
  api: ReturnType<typeof createCardApi>,
  uploadFile: ReturnType<typeof useUpload>["uploadFile"],
  deleteFile: ReturnType<typeof useUpload>["deleteFile"]
) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      cardId,
      data,
      currentProfilePicture,
    }: {
      cardId: string;
      data: Partial<Card>;
      // the existing URL already stored in DB, passed in from cardData
      currentProfilePicture?: string | null;
    }) => {
      if (!cardId) return;

      let updatedData: Partial<Card> = { ...data };

      // ── Case 1: user picked a new image File ──────────────────────────────
      // Delete old file from storage first to avoid orphaned files, then upload new
      if (data.profile_picture instanceof File) {
        if (currentProfilePicture) {
          await deleteFile(currentProfilePicture);
        }
        updatedData.profile_picture = await uploadFile(data.profile_picture);
      }

      // ── Case 2: user explicitly removed their picture (set to null) ───────
      // Delete from storage AND send null to DB
      else if (data.profile_picture === null) {
        if (currentProfilePicture) {
          await deleteFile(currentProfilePicture);
        }
        updatedData.profile_picture = null;
      }

      // ── Case 3: profile_picture is an unchanged string URL ────────────────
      // User didn't touch the avatar field — pass through as-is, no storage ops

      await api.update(cardId, updatedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["card", userId] });
      toastShared({ title: "Card updated successfully" });
      router.refresh();
    },
    onError: (error: Error) => {
      toastShared({
        title: "Something went wrong",
        description: getErrorMessage(error),
        variant: "error",
      });
    },
  });
}

// ─── Main Hook ────────────────────────────────────────────────────────────────

export function useCard() {
  const { api, userId } = useCardApi();
  const { step, setStep, reset } = useCardStep();

  const { updateProfile } = useProfile();
  const { createLinks } = useLinks();
  const { uploadFile, deleteFile } = useUpload();

  const { data: cardData, isLoading: isLoadingCard } = useCardQuery(userId, api);

  const { isPending: isUpdating, mutateAsync: updateCard } = useUpdateCardMutation(
    userId,
    api,
    uploadFile,
    deleteFile
  );

  const { isPending: isCreating, mutateAsync: createCard } = useCreateCardMutation({
    userId,
    api,
    setStep,
    updateProfile,
    uploadFile,
    createLinks,
  });

  const { isPending: isDeleting, mutateAsync: deleteCard } = useDeleteCardMutation(userId, api);

  return {
    cardData,
    hasCard: !!cardData,
    createCard,
    deleteCard,
    updateCard,
    isLoadingCard,
    isCreating,
    isDeleting,
    isUpdating,
    isPending: isDeleting || isCreating || isUpdating,
    error: null,
    step,
    resetStep: reset,
  };
}