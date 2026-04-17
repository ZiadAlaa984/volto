// hooks/useBusinessInfo.ts
"use client"
import { useAuth } from "@/context/AuthContext"
import { errorToast, toastShared } from "@/lib/utils"
import { createBuinessApi } from "@/services/instances/BusinessApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUpload } from "./useUpload"
import { BusinessType, MenuItemType } from "@/types/business"
import { useRouter } from "next/navigation"
import Router from "@/lib/route"
import { CardType } from "@/types/onboarding"
import { MenuItemValue } from "@/lib/Schema/InfoBusiness"

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
            await api.create({ ...data, user_id: session.user.id })
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
        onError: (error) => errorToast(error as Error),
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
                menu?: MenuItemValue[]   // form values (may contain File objects)
            }
            currentMenu?: BusinessType["menu"]  // saved DB rows (all { type, value })
        }) => {
            if (!id || !card_id) return
            if (!isBusinessOwner) throw new Error("Only the business card owner can update this.")

            // ── Normalize current (DB) menu to a safe array ────────────────
            const oldItems: MenuItemType[] = currentMenu ?? []

            // ── Process each incoming item ─────────────────────────────────
            const resolvedMenu: MenuItemType[] = []

            // Inside mutationFn, replace the loop:

            for (const item of data.menu ?? []) {
                const content = item.content

                // 🔴 New File upload
                if (content instanceof File) {
                    if (!ALLOWED_MENU_TYPES.includes(content.type)) {
                        throw new Error("Invalid file type. Only PDF, JPEG, PNG, WebP, and GIF are allowed.")
                    }
                    const uploadedUrl = await uploadFile(content, {
                        bucket: "menus",
                        folder: card_id,
                    })
                    if (!uploadedUrl) throw new Error("Failed to upload menu file")
                    resolvedMenu.push({
                        type: "file",
                        value: uploadedUrl,
                        label: item.label || undefined,
                    })
                }

                // 🔴 Text link or already-saved file — keep as-is
                else if (content && typeof content === "object") {
                    resolvedMenu.push({
                        ...content,
                        label: item.label || undefined,
                    })
                }

                // 🔴 null content — skip (don't save empty rows)
            }

            // ── Delete any old FILE items that are no longer in the new list ──
            const newFileUrls = new Set(
                resolvedMenu
                    .filter(i => i.type === "file")
                    .map(i => i.value)
            )

            for (const old of oldItems) {
                if (old.type === "file" && !newFileUrls.has(old.value)) {
                    await deleteFile(old.value, { bucket: "menus" })
                }
            }

            await api.update(id, {
                ...data,
                menu: resolvedMenu.length > 0 ? resolvedMenu : null,
            })
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