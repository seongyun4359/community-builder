import type { User } from "@/types";
import { apiFetch, normalizeId } from "@/services/api";

type UserFromAPI = {
  _id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  role: string;
  provider: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
};

function normalizeUser(u: UserFromAPI): User {
  const n = normalizeId(u);
  return {
    id: n.id,
    email: n.email,
    nickname: n.nickname,
    profileImage: n.profileImage,
    role: n.role as User["role"],
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export async function fetchMe(): Promise<User | null> {
  const data = await apiFetch<UserFromAPI | null>("/api/auth/me", { cache: "no-store" });
  return data ? normalizeUser(data) : null;
}

export async function logoutSession(): Promise<void> {
  await apiFetch<boolean>("/api/auth/logout", { method: "POST" });
}

