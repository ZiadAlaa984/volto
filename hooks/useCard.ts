"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync, errorToast, toastShared } from "@/lib/utils";
import { createCardApi } from "@/services/instances/cardApi";
import { CardType } from "@/types/onboarding";
import { Card } from "@/lib/Schema/CardInfoSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useProfile } from "./useProfile";
import { useLinks } from "./useLink";
import { useUpload } from "./useUpload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CARD_CREATION_STEPS from "@/lib/utils/steps";

export function useCard() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { session } = useAuth()

  const userId = session?.user?.id
  const api = createCardApi(session)

  const { updateProfile } = useProfile()
  const { createLinks } = useLinks()
  const { uploadFile, deleteFile } = useUpload()

  const [step, setStep] = useState<number>(CARD_CREATION_STEPS.IDLE)
  const resetStep = () => setStep(CARD_CREATION_STEPS.IDLE)

  const invalidateCard = () => queryClient.invalidateQueries({ queryKey: ["card", userId] })

  // ─── Get ──────────────────────────────────────────────────────────────────

  const { data: cardData, isLoading: isLoadingCard } = useQuery({
    queryKey: ["card", userId],
    enabled: !!userId,
    queryFn: catchAsync(async () => {
      return await api.getById(userId!, "user_id") ?? null
    }),
  })

  // ─── Create ───────────────────────────────────────────────────────────────

  const { isPending: isCreating, mutateAsync: createCard } = useMutation({
    mutationFn: async (payload: CardType) => {
      if (!userId) return
      const { name, bio, user_name, links, profile_picture } = payload

      setStep(CARD_CREATION_STEPS.SETTING_PROFILE)
      await updateProfile({ user_name })

      setStep(CARD_CREATION_STEPS.UPLOADING_PROFILE_PICTURE)
      const uploadedPicture = await uploadFile(profile_picture as File)

      setStep(CARD_CREATION_STEPS.CREATING_CARD)
      const card = await api.create({ user_id: userId, name, bio, profile_picture: uploadedPicture }) as CardType

      if (links?.length) {
        setStep(CARD_CREATION_STEPS.CREATING_LINKS)
        await createLinks(links.map((link, i) => ({ ...link, card_id: card.id, order_num: i + 1 })))
      }

      setStep(CARD_CREATION_STEPS.DONE)
      return user_name
    },
    onSuccess: (username) => {
      if (!username) return
      toastShared({ title: "Card created successfully", description: "Redirecting you to your card page..." })
      router.push(`/${username}`)
    },
    onError: errorToast,
  })

  // ─── Update ───────────────────────────────────────────────────────────────

  const { isPending: isUpdating, mutateAsync: updateCard } = useMutation({
    mutationFn: async ({ cardId, data, currentProfilePicture }: {
      cardId: string
      data: Partial<Card>
      currentProfilePicture?: string | null
    }) => {
      if (!cardId) return

      let updatedData: Partial<Card> = { ...data }

      if (data.profile_picture instanceof File) {
        if (currentProfilePicture) await deleteFile(currentProfilePicture)
        updatedData.profile_picture = await uploadFile(data.profile_picture)
      } else if (data.profile_picture === null) {
        if (currentProfilePicture) await deleteFile(currentProfilePicture)
        updatedData.profile_picture = null
      }

      await api.update(cardId, updatedData)
    },
    onSuccess: () => {
      invalidateCard()
      toastShared({ title: "Card updated successfully" })
    },
    onError: errorToast,
  })

  // ─── Update Card Type ─────────────────────────────────────────────────────

  const { isPending: isUpdatingCardType, mutateAsync: updateCardType } = useMutation({
    mutationFn: async ({ cardId, card_type }: { cardId: string; card_type: "business" | "personal" }) => {
      if (!cardId) return
      await api.update(cardId, { card_type })
    },
    onSuccess: () => {
      invalidateCard()
      toastShared({ title: "Card type updated successfully" })
    },
    onError: errorToast,
  })

  // ─── Delete ───────────────────────────────────────────────────────────────

  const { isPending: isDeleting, mutateAsync: deleteCard } = useMutation({
    mutationFn: async (cardData: CardType) => {
      if (!cardData?.id) return
      if (cardData.profile_picture) await deleteFile(cardData.profile_picture as string)
      await api.delete(cardData.id)
    },
    onSuccess: () => {
      invalidateCard()
      toastShared({ title: "Card deleted successfully" })
    },
    onError: errorToast,
  })

  // ─── Return ───────────────────────────────────────────────────────────────

  return {
    cardData,
    hasCard: !!cardData,
    createCard,
    updateCard,
    updateCardType,
    deleteCard,
    isLoadingCard,
    isCreating,
    isUpdating,
    isDeleting,
    isPending: isCreating || isUpdating || isDeleting || isUpdatingCardType,
    step,
    resetStep,
  }
}