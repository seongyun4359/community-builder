import type { User } from "@/types";

// TODO: Supabase 연동 후 실제 DB 호출로 교체
export async function getUserById(id: string): Promise<User | null> {
  return null;
}

export async function getUsersByRole(role: string): Promise<User[]> {
  return [];
}
