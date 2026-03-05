import type { Member, UserRole } from "@/types";
import { apiFetch, normalizeId } from "./api";

export async function fetchMembers(slug: string): Promise<Member[]> {
  const list = await apiFetch<(Member & { _id: string })[]>(`/api/communities/${slug}/members`);
  return list.map(normalizeId);
}

export async function updateMemberRole(slug: string, userId: string, role: UserRole): Promise<Member> {
  const data = await apiFetch<Member & { _id: string }>(`/api/communities/${slug}/members`, {
    method: "PUT",
    body: JSON.stringify({ userId, role }),
  });
  return normalizeId(data);
}
