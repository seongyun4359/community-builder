import type { User, SignupProfileForm } from "@/types";

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

export function saveKakaoUser(data: KakaoCallbackData): User {
  const existing = getStoredUser();

  const user: User = {
    id: existing?.id === data.id ? existing.id : data.id,
    email: data.email,
    nickname: existing?.nickname || data.nickname,
    profileImage: data.profileImage || existing?.profileImage,
    role: existing?.role || "super_admin",
    createdAt: existing?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storeUser(user);
  return user;
}

export async function updateProfile(form: SignupProfileForm): Promise<User> {
  const current = getStoredUser();
  if (!current) throw new Error("로그인이 필요합니다.");

  const updated: User = {
    ...current,
    nickname: form.nickname,
    profileImage: form.profileImage,
    updatedAt: new Date().toISOString(),
  };

  storeUser(updated);
  return updated;
}

export function logout() {
  storeUser(null);
}

export function getKakaoLoginUrl(mode: "login" | "signup" = "login"): string {
  return `/api/auth/kakao?mode=${mode}`;
}
