import type { Comment } from "@/types";
import { apiFetch, normalizeId } from "./api";

export async function fetchComments(slug: string, postId: string): Promise<Comment[]> {
  const list = await apiFetch<(Comment & { _id: string })[]>(
    `/api/communities/${slug}/posts/${postId}/comments`
  );
  return list.map(normalizeId);
}

export async function createComment(
  slug: string,
  postId: string,
  content: string
): Promise<Comment> {
  const data = await apiFetch<Comment & { _id: string }>(
    `/api/communities/${slug}/posts/${postId}/comments`,
    {
      method: "POST",
      body: JSON.stringify({ content }),
    }
  );
  return normalizeId(data);
}

export async function deleteComment(
  slug: string,
  postId: string,
  commentId: string
): Promise<void> {
  await apiFetch(
    `/api/communities/${slug}/posts/${postId}/comments/${commentId}`,
    { method: "DELETE" }
  );
}
