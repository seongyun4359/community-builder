import type { User, SignupProfileForm } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface UserFromAPI {
  _id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  role: string;
  provider: string;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

function normalize(u: UserFromAPI): User {
  return {
    id: u._id,
    email: u.email,
    nickname: u.nickname,
    profileImage: u.profileImage,
    role: u.role as User["role"],
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export async function updateUserProfile(userId: string, form: SignupProfileForm): Promise<User> {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });
  const json: ApiResponse<UserFromAPI> = await res.json();
  if (!json.success) throw new Error(json.error || "프로필 업데이트에 실패했습니다.");
  return normalize(json.data!);
}

export async function fetchUser(userId: string): Promise<User | null> {
  try {
    const res = await fetch(`/api/users/${userId}`);
    const json: ApiResponse<UserFromAPI> = await res.json();
    if (!json.success) return null;
    return normalize(json.data!);
  } catch {
    return null;
  }
}
