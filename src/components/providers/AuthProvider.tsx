"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import type { User, AuthContextValue, SignupProfileForm } from "@/types";
import { getStoredUser, storeUser, type KakaoCallbackData } from "@/lib/auth";
import { updateUserProfile } from "@/services/user";

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const setUserFromKakao = useCallback((data: KakaoCallbackData) => {
    const userData: User = {
      id: data.id,
      email: data.email,
      nickname: data.nickname,
      profileImage: data.profileImage,
      role: "super_admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    storeUser(userData);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    storeUser(null);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (form: SignupProfileForm) => {
    if (!user) throw new Error("로그인이 필요합니다.");
    setIsLoading(true);
    try {
      const updated = await updateUserProfile(user.id, form);
      storeUser(updated);
      setUser(updated);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, setUserFromKakao, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
