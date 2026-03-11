"use client";

import { createContext, useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { AuthContextValue, SignupProfileForm, User } from "@/types";
import { updateUserProfile } from "@/services/user";
import { logoutSession } from "@/services/auth";
import { qk } from "@/queries/keys";
import { useMeQuery } from "@/queries/hooks";

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { data: me, isLoading: isMeLoading } = useMeQuery();
  const [isUpdating, setIsUpdating] = useState(false);

  const user = me ?? null;
  const isLoading = isMeLoading || isUpdating;

  const logout = useCallback(async () => {
    try {
      await logoutSession();
    } finally {
      qc.setQueryData<User | null>(qk.me, null);
    }
  }, [qc]);

  const updateProfile = useCallback(
    async (form: SignupProfileForm) => {
      if (!user) throw new Error("로그인이 필요합니다.");
      setIsUpdating(true);
      try {
        const updated = await updateUserProfile(user.id, form);
        qc.setQueryData<User | null>(qk.me, updated);
      } finally {
        setIsUpdating(false);
      }
    },
    [qc, user]
  );

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
