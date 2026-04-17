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
            if (!session?.user?.id) throw new Error("Not authenticated")
            await api.create({
                ...data,
                user_id: session.user.id
            })
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
            data: Omit<Partial<BusinessType>, "menu"> & {
                menu?: File | BusinessType["menu"] | null
            }
            currentMenu?: BusinessType["menu"]
        }) => {
            if (!id || !card_id) return

            if (!isBusinessOwner) {
                throw new Error("Only the business card owner can update this.")
            }

            let updatedData: Partial<BusinessType> = {
                ...data,
                menu: undefined,
            }

            const isNewFile = data.menu instanceof File
            const isText = data.menu && typeof data.menu === "object" && data.menu.type === "text"
            const isExistingFile =
                data.menu && typeof data.menu === "object" && data.menu.type === "file"

            // ─────────────────────────────────────────────────────────────
            // 🔴 Case 1: Upload new file
            // ─────────────────────────────────────────────────────────────
            if (isNewFile) {
                if (!data.menu || !ALLOWED_MENU_TYPES.includes(data.menu.type)) {
                    throw new Error(
                        "Invalid file type. Only PDF, JPEG, PNG, WebP, and GIF are allowed."
                    )
                }

                // delete old file if exists
                if (currentMenu?.type === "file") {
                    await deleteFile(currentMenu.value, { bucket: "menus" })
                }

                const uploadedUrl = await uploadFile(data.menu as File, {
                    bucket: "menus",
                    folder: card_id,
                })

                if (!uploadedUrl) {
                    throw new Error("Failed to upload menu file")
                }

                updatedData.menu = { type: "file", value: uploadedUrl }
            }

            // ─────────────────────────────────────────────────────────────
            // 🔴 Case 2: Clear menu (null)
            // ─────────────────────────────────────────────────────────────
            else if (data.menu === null) {
                if (currentMenu?.type === "file") {
                    await deleteFile(currentMenu.value, { bucket: "menus" })
                }

                updatedData.menu = null
            }

            // ─────────────────────────────────────────────────────────────
            // 🔴 Case 3: New TEXT (important fix here)
            // ─────────────────────────────────────────────────────────────
            else if (isText) {
                // ✅ delete old file if existed
                if (currentMenu?.type === "file") {
                    await deleteFile(currentMenu.value, { bucket: "menus" })
                }

                updatedData.menu = {
                    type: "text",
                    value: (data.menu as { type: "text"; value: string }).value,
                }
            }

            // ─────────────────────────────────────────────────────────────
            // 🔴 Case 4: Keep existing file
            // ─────────────────────────────────────────────────────────────
            else if (isExistingFile) {
                updatedData.menu = data.menu as { type: "text" | "file"; value: string }
            }

            await api.update(id, updatedData)
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business", card_id] })
            toastShared({ title: "Business info updated successfully" })
        },

        onError: errorToast,
    })


    // ─── Toggle Active Reviews ─────────────────────────────────────────────
    const { isPending: isTogglingReviews, mutateAsync: toggleActiveReviews } = useMutation({
        mutationFn: async (active_reviews: boolean) => {
            if (!businessData?.id || !card_id) throw new Error("Business not found")
            if (!isBusinessOwner) throw new Error("Only the business owner can toggle reviews.")
            await api.update(businessData.id, { active_reviews })
        },
        onSuccess: (_, active_reviews) => {
            queryClient.invalidateQueries({ queryKey: ["business", card_id] })
            queryClient.invalidateQueries({ queryKey: ["reviews", card_id] })
            toastShared({
                title: active_reviews ? "Reviews activated" : "Reviews deactivated",
                variant: "success",
            })
        },
        onError: errorToast,
    })


    return {

        createBusiness,
        updateBusiness,
        toggleActiveReviews,
        isTogglingReviews,
        isPending: isUpdating || isCreating,
        businessData,
        isLoading: isLoadingBusiness,
        isBusinessOwner,
    }
}

export default useBusinessInfo