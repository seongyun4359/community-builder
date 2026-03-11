import type { UserRole } from "./user";

export interface Invitation {
  id: string;
  communityId: string;
  token: string;
  createdBy: string;
  role: UserRole;
  expiresAt: string;
  maxUses: number | null;
  usedCount: number;
  createdAt: string;
}

export interface CreateInvitationResult {
  token: string;
  inviteUrl: string;
  expiresAt: string;
  role: string;
}
