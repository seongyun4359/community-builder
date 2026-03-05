import type { Post, CreatePostForm } from "@/types";
import { apiFetch, normalizeId } from "./api";

interface PostListResponse {
  posts: (Post & { _id: string })[];
  total: number;
  page: number;
  limit: number;
}

export interface PostListResult {
  posts: Post[];
  total: number;
  page: number;
  limit: number;
}

export async function fetchPosts(
  slug: string,
  options?: { boardId?: string; authorId?: string; page?: number; limit?: number }
): Promise<PostListResult> {
  const params = new URLSearchParams();
  if (options?.boardId) params.set("boardId", options.boardId);
  if (options?.authorId) params.set("authorId", options.authorId);
  if (options?.page) params.set("page", String(options.page));
  if (options?.limit) params.set("limit", String(options.limit));

  const qs = params.toString();
  const data = await apiFetch<PostListResponse>(`/api/communities/${slug}/posts${qs ? `?${qs}` : ""}`);
  return {
    ...data,
    posts: data.posts.map(normalizeId),
  };
}

export async function fetchPost(slug: string, postId: string): Promise<Post> {
  const data = await apiFetch<Post & { _id: string }>(`/api/communities/${slug}/posts/${postId}`);
  return normalizeId(data);
}

export async function createPost(slug: string, form: CreatePostForm, authorId: string): Promise<Post> {
  const data = await apiFetch<Post & { _id: string }>(`/api/communities/${slug}/posts`, {
    method: "POST",
    body: JSON.stringify({ ...form, authorId }),
  });
  return normalizeId(data);
}

export async function deletePost(slug: string, postId: string): Promise<void> {
  await apiFetch(`/api/communities/${slug}/posts/${postId}`, { method: "DELETE" });
}

export async function togglePin(slug: string, postId: string, isPinned: boolean): Promise<Post> {
  const data = await apiFetch<Post & { _id: string }>(`/api/communities/${slug}/posts/${postId}`, {
    method: "PUT",
    body: JSON.stringify({ isPinned }),
  });
  return normalizeId(data);
}
