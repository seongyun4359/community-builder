export type UserRole = "super_admin" | "admin" | "moderator" | "member" | "guest";

export interface User {
  id: string;
  email: string;
  nickname: string;
  profileImage?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
