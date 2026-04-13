"use client"
import { useAuth } from "@/context/AuthContext"
import { errorToast, toastShared } from "@/lib/utils"
import { createBuinessApi } from "@/services/instances/BusinessApi"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useUpload } from "./useUpload"
import { BusinessType } from "@/types/business"
import { useRouter } from "next/navigation"
import Router from "@/lib/route"

const useBusinessInfo = (card_id?: string) => {
    const queryClient = useQueryClient()
    const { session } = useAuth()
    const { uploadFile, deleteFile } = useUpload()
    const api = createBuinessApi(session)
    const router = useRouter();
    // ─── Query ─────────────────────────────────────────────────────────────

    const { data: businessData, isLoading: isLoadingBusiness } = useQuery({
        queryKey: ["business", card_id],
        enabled: !!card_id,
        queryFn: async () => {
            console.log(card_id);

            try {
                return await api.getById(card_id!, "card_id") ?? null
            } catch (error) {
                errorToast(error as Error)
                return null
            }
        },
    })

    // create
    const { isPending: isCreating, mutateAsync: createBusiness } = useMutation({
        mutationFn: async (data: Partial<BusinessType>) => {
            await api.create(data)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["business"] });
            toastShared({
                title: "Business created successfully",
                description: "Your business has been created successfully.",
                variant: "success"
            });
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
            currentMenu,       // existing menu URL from DB (string | null)
        }: {
            id: string
            data: Partial<BusinessType> & { menu?: any }
            currentMenu?: string | null
        }) => {
            if (!id) return

            let updatedData: Partial<BusinessType> = { ...data }

            if (data.menu instanceof File) {
                // New file selected — delete old if exists, upload new
                if (currentMenu) await deleteFile(currentMenu)
                updatedData.menu = await uploadFile(data.menu)
            } else if (data.menu === null) {
                // Menu explicitly removed
                if (currentMenu) await deleteFile(currentMenu)
                updatedData.menu = null
            }
            // string URL unchanged — pass through as-is

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
    }
}

export default useBusinessInfo