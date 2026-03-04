"use client";

import { createContext, useCallback, useEffect, useState } from "react";
import type { User, AuthContextValue, SocialProvider, SignupProfileForm } from "@/types";
import { getStoredUser, mockSocialLogin, mockUpdateProfile, mockLogout } from "@/lib/auth";

export const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getStoredUser());
    setIsLoading(false);
  }, []);

  const loginWithSocial = useCallback(async (provider: SocialProvider) => {
    setIsLoading(true);
    try {
      const loggedInUser = await mockSocialLogin(provider);
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    mockLogout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (form: SignupProfileForm) => {
    setIsLoading(true);
    try {
      const updated = await mockUpdateProfile(form);
      setUser(updated);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, loginWithSocial, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
