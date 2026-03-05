"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import type { User, AuthContextValue, SignupProfileForm } from "@/types";
import {
  getStoredUser,
  saveKakaoUser,
  updateProfile as updateProfileFn,
  logout as logoutFn,
  type KakaoCallbackData,
} from "@/lib/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const setUserFromKakao = useCallback((data: KakaoCallbackData) => {
    const saved = saveKakaoUser(data);
    setUser(saved);
  }, []);

  const logout = useCallback(() => {
    logoutFn();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (form: SignupProfileForm) => {
    setIsLoading(true);
    try {
      const updated = await updateProfileFn(form);
      setUser(updated);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, setUserFromKakao, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
