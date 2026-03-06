import type { User } from "@/types";

const STORAGE_KEY = "community-builder-auth";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export interface KakaoCallbackData {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  provider: string;
}

export function getKakaoLoginUrl(mode: "login" | "signup" = "login"): string {
  return `/api/auth/kakao?mode=${mode}`;
}
