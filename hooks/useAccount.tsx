"use client";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { toastShared } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAccount() {
    const { session, signOut } = useAuth();
    const userId = session?.user?.id;
    const router = useRouter();

    const { mutateAsync: deleteAccount, isPending: isDeletingAccount } = useMutation({
        mutationFn: async () => {
            if (!userId) throw new Error("No user session");

            const { error } = await supabase
                .from("profiles")
                .update({ deleted_at: new Date().toISOString() })
                .eq("id", userId);

            if (error) throw error;

            await signOut();
        },
        onSuccess: () => {
            toastShared({ title: "Account deleted successfully" });
            router.replace("/auth/account-deleted");
        },
        onError: (error: Error) => {
            toastShared({
                title: "Error deleting account",
                description: error.message,
                variant: "error",
            });
        },
    });

    return {
        deleteAccount,
        isDeletingAccount,
    };
}