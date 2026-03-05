export type CommunityTheme = "default" | "minimal" | "vibrant" | "dark" | "nature";

export interface Community {
  id: string;
  slug: string;
  name: string;
  description: string;
  theme: CommunityTheme;
  logoUrl?: string;
  ownerId: string;
  memberCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommunityForm {
  slug: string;
  name: string;
  description: string;
  theme: CommunityTheme;
}

export interface Board {
  id: string;
  communityId: string;
  name: string;
  description?: string;
  type: "general" | "notice" | "gallery";
  order: number;
  createdAt: string;
}
