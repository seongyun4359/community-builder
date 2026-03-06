import type { Community, CreateCommunityForm, Board } from "@/types";
import { apiFetch, normalizeId } from "./api";

export async function fetchCommunitiesByOwner(ownerId: string): Promise<Community[]> {
  const list = await apiFetch<(Community & { _id: string })[]>(`/api/communities?ownerId=${ownerId}`);
  return list.map(normalizeId);
}

export async function fetchCommunityBySlug(slug: string): Promise<Community | null> {
  try {
    const c = await apiFetch<Community & { _id: string }>(`/api/communities/${slug}`);
    return normalizeId(c);
  } catch {
    return null;
  }
}

export async function createCommunityAPI(
  form: CreateCommunityForm
): Promise<Community> {
  const c = await apiFetch<Community & { _id: string }>("/api/communities", {
    method: "POST",
    body: JSON.stringify(form),
  });
  return normalizeId(c);
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const result = await apiFetch<{ available: boolean }>(`/api/communities/check-slug?slug=${slug}`);
  return result.available;
}

export async function fetchBoardsBySlug(slug: string): Promise<Board[]> {
  const list = await apiFetch<(Board & { _id: string })[]>(`/api/communities/${slug}/boards`);
  return list.map(normalizeId);
}
