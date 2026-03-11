"use client";

export const qk = {
  me: ["me"] as const,
  community: (slug: string) => ["community", slug] as const,
  communitiesByOwner: (ownerId: string) => ["communities", "owner", ownerId] as const,
  boards: (slug: string) => ["boards", slug] as const,
  postList: (slug: string, params: { boardId?: string; authorId?: string; page?: number; limit?: number }) =>
    [
      "posts",
      slug,
      params.boardId ?? "all",
      params.authorId ?? "all",
      params.page ?? 1,
      params.limit ?? 20,
    ] as const,
  post: (slug: string, postId: string) => ["post", slug, postId] as const,
  notifications: (slug: string) => ["notifications", slug] as const,
  members: (slug: string) => ["members", slug] as const,
  events: (slug: string) => ["events", slug] as const,
  inviteInfo: (token: string) => ["invite", token] as const,
};

