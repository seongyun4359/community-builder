import type { User, SocialProvider, SignupProfileForm } from "@/types";

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

function storeUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export async function mockSocialLogin(provider: SocialProvider): Promise<User> {
  await new Promise((r) => setTimeout(r, 500));

  const mockEmails: Record<SocialProvider, string> = {
    google: "admin@gmail.com",
    kakao: "admin@kakao.com",
  };

  const user: User = {
    id: crypto.randomUUID(),
    email: mockEmails[provider],
    nickname: "",
    role: "super_admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storeUser(user);
  return user;
}

export async function mockUpdateProfile(form: SignupProfileForm): Promise<User> {
  await new Promise((r) => setTimeout(r, 300));

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

export function mockLogout() {
  storeUser(null);
}
