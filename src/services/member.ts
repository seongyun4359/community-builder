import type { Member, UserRole } from "@/types";
import type { CreateInvitationResult } from "@/types/invitation";
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

export async function expelMember(slug: string, userId: string): Promise<void> {
  await apiFetch(`/api/communities/${slug}/members`, {
    method: "DELETE",
    body: JSON.stringify({ userId }),
  });
}

export async function createInvite(
  slug: string,
  options?: { role?: UserRole; expiresDays?: number; maxUses?: number | null }
): Promise<CreateInvitationResult> {
  const data = await apiFetch<CreateInvitationResult & { id?: string }>(`/api/communities/${slug}/invites`, {
    method: "POST",
    body: JSON.stringify(options ?? {}),
  });
  return {
    token: data.token,
    inviteUrl: data.inviteUrl,
    expiresAt: data.expiresAt,
    role: data.role,
  };
}

export interface InviteInfo {
  communityName: string;
  communitySlug: string;
  role: string;
  expiresAt: string;
}

export async function getInviteInfo(token: string): Promise<InviteInfo> {
  return apiFetch<InviteInfo>(`/api/invites/${token}`);
}

export async function acceptInvite(token: string): Promise<{ communitySlug: string; communityName: string }> {
  return apiFetch<{ communitySlug: string; communityName: string }>(`/api/invites/${token}`, {
    method: "POST",
  });
}
