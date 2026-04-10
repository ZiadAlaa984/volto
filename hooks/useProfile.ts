"use client";

import { useAuth } from "@/context/AuthContext";
import { catchAsync, toastShared } from "@/lib/utils";
import { createProfileApi } from "@/services/instances/profileApi";
import { Profile } from "@/types/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export function useProfile() {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  // ✅ memoized — same instance across renders, only recreates if session changes
  const api = useMemo(() => createProfileApi(session), [session]);

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
    onError: (error) => {
      toastShared({ title: "Failed to check username", description: error.message });
    },
  });

  const {
    data: profileData,
    isLoading: isFetchingProfile,
    error: fetchProfileError,
  } = useQuery<Profile | null>({
    queryKey: ["profile", userId],
    queryFn: async (): Promise<Profile | null> => {
      if (!userId) return null;
      const data = await api.getById(userId, "id");
      return data as Profile | null;
    },
    enabled: !!userId,
  });

  const {
    isPending: isUpdating,
    mutateAsync: updateProfile,
    error: updateError,
  } = useMutation({
    mutationFn: catchAsync(async (data: Partial<Profile>) => {
      if (!data || !userId) return false;
      const { data: updated, error } = await api.update(userId, data);
      if (error) throw error;
      return updated;
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
    onError: (error) => {
      toastShared({ title: "Failed to update profile", description: error.message });
    },
  });

  return {
    profileData,
    updateProfile,
    checkUsername,
    isLoading: isFetchingProfile,
    isPending: isCheckingUsername || isUpdating,
    error: checkUsernameError || updateError || fetchProfileError,
  };
}