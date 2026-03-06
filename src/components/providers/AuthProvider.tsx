"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import type { User, AuthContextValue, SignupProfileForm } from "@/types";
import { updateUserProfile } from "@/services/user";
import { fetchMe, logoutSession } from "@/services/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMe()
      .then((me) => setUser(me))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = useCallback(() => {
    logoutSession()
      .catch(() => {})
      .finally(() => setUser(null));
  }, []);

  const updateProfile = useCallback(async (form: SignupProfileForm) => {
    if (!user) throw new Error("로그인이 필요합니다.");
    setIsLoading(true);
    try {
      const updated = await updateUserProfile(user.id, form);
      setUser(updated);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
