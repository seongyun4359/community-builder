import type { User, UserRole } from "./user";

export interface Member {
  id: string;
  communityId: string;
  userId: string;
  user?: User;
  role: UserRole;
  joinedAt: string;
}
