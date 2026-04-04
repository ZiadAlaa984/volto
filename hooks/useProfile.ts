"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync } from "@/lib/utils";
import { createProfileApi } from "@/services/instances/profileApi";
import { Profile } from "@/types/profile";
import { useMutation } from "@tanstack/react-query";

export function useProfile() {
  const { session } = useAuth();
  const id = session?.user?.id;
  const api = createProfileApi(session);

  const {
    isPending: checkUsernamePending,
    mutateAsync: checkUsername,
    error: checkUsernameError,
  } = useMutation({
    mutationFn: async (user_name: string) => {
      if (!user_name) return false;

      const data = await api.getAll({
        filters: { user_name } as Partial<Profile>,
        limit: 1,
        skipUserFilter: true,
      });

      return data.length > 0;
    },
  });

  const {
    isPending: updatePending,
    mutateAsync: update,
    error: updateError,
  } = useMutation({
    mutationFn: catchAsync(async (profileData: Partial<Profile>) => {
      if (!profileData || !id) return false;

      const { data, error } = await api.update(id, profileData);

      if (error) throw error;

      return data;
    }),
  });

  return {
    update,
    checkUsername,
    isPending: checkUsernamePending || updatePending,
    error: checkUsernameError || updateError,
  };
}
