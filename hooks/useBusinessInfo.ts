"use client"
import { useAuth } from "@/context/AuthContext"
import { errorToast, toastShared } from "@/lib/utils"
import { createBuinessApi } from "@/services/instances/BusinessApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUpload } from "./useUpload"
import { BusinessType } from "@/types/business"
import { useRouter } from "next/navigation"
import Router from "@/lib/route"
import { CardType } from "@/types/onboarding"

const ALLOWED_MENU_TYPES = [
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
]

const useBusinessInfo = (card_id?: string, cardData?: CardType) => {
    const queryClient = useQueryClient()
    const { session } = useAuth()
    const { uploadFile, deleteFile } = useUpload()
    const api = createBuinessApi(session)
    const router = useRouter()

    // ─── Guard: JS-level ownership + card_type check ───────────────────────
    const isBusinessOwner =
        !!cardData &&
        cardData.card_type === "business" &&
        cardData.user_id === session?.user?.id

    // ─── Query ─────────────────────────────────────────────────────────────
    const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
        queryKey: ["business", card_id],
        enabled: !!card_id,
        queryFn: async () => {
            try {
                return (await api.getById(card_id!, "card_id")) ?? null
            } catch (error) {
                errorToast(error as Error)
                return null
            }
        },
    })

    // ─── Create ────────────────────────────────────────────────────────────
    const { isPending: isCreating, mutateAsync: createBusiness } = useMutation({
        mutationFn: async (data: Partial<BusinessType>) => {
            await api.create(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business"] })
            toastShared({
                title: "Business created successfully",
                description: "Your business has been created successfully.",
                variant: "success",
            })
            router.push(Router.DASHBOARD.businessCard)
        },
        onError: (error) => {
            errorToast(error as Error)
        },
    })

    // ─── Update ────────────────────────────────────────────────────────────
    const { isPending: isUpdating, mutateAsync: updateBusiness } = useMutation({
        mutationFn: async ({
            id,
            data,
            currentMenu,
        }: {
            id: string
            data: Omit<Partial<BusinessType>, "menu"> & { menu?: File | string | null } // ← override menu type
            currentMenu?: string | null
        }) => {
            console.log("🚀 ~ useBusinessInfo ~ card_id:", card_id)
            if (!id || !card_id) return

            if (!isBusinessOwner) {
                throw new Error("Only the business card owner can update this.")
            }

            let updatedData: Partial<BusinessType> = {
                ...data,
                menu: data.menu instanceof File ? undefined : data.menu ?? undefined // temp, will be replaced below
            }

            if (data.menu instanceof File) {
                if (!ALLOWED_MENU_TYPES.includes(data.menu.type)) {
                    throw new Error(
                        "Invalid file type. Only PDF, JPEG, PNG, WebP, and GIF are allowed."
                    )
                }

                if (currentMenu) await deleteFile(currentMenu, { bucket: "menu", folder: card_id })


                updatedData.menu = await uploadFile(data.menu, { bucket: "menu", folder: card_id })

            } else if (data.menu === null) {
                if (currentMenu) await deleteFile(currentMenu, { bucket: "menu", folder: card_id })
                updatedData.menu = undefined // or null if your DB accepts it
            } else {
                updatedData.menu = data.menu // string URL unchanged
            }

            await api.update(id, updatedData)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business", card_id] })
            toastShared({ title: "Business info updated successfully" })
        },
        onError: errorToast,
    })

    return {
        createBusiness,
        updateBusiness,
        isPending: isUpdating || isCreating,
        businessData,
        isLoading: isLoadingBusiness,
        isBusinessOwner, // expose so UI can conditionally show upload button
    }
}

export default useBusinessInfo