"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync } from "@/lib/utils";
import { createProfileApi } from "@/services/instances/profileApi";
import { Profile } from "@/types/profile";
import { useMutation } from "@tanstack/react-query";

export function useProfile() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const api = createProfileApi(session);

  const {
    isPending: isCheckingUsername,
    mutateAsync: checkUsername,
    error: checkUsernameError,
  } = useMutation({
    mutationFn: async (username: string) => {
      if (!username) return false;

      const matches = await api.getAll({
        filters: { user_name: username } as Partial<Profile>,
        limit: 1,
        skipUserFilter: true,
      });

      return matches.length > 0;
    },
  });

  const {
    isPending: isUpdating,
    mutateAsync: updateProfile,
    error: updateError,
  } = useMutation({
    mutationFn: catchAsync(async (profileData: Partial<Profile>) => {
      if (!profileData || !userId) return false;

      const { data, error } = await api.update(userId, profileData);

      if (error) throw error;

      return data;
    }),
  });

  return {
    updateProfile,
    checkUsername,
    isPending: isCheckingUsername || isUpdating,
    error: checkUsernameError || updateError,
  };
}