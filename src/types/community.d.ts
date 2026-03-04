export type CommunityTheme = "default" | "minimal" | "vibrant" | "dark" | "nature";

export interface Community {
  id: string;
  name: string;
  description: string;
  theme: CommunityTheme;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
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
