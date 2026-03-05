import type { Community, CreateCommunityForm, Board } from "@/types";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  const json: ApiResponse<T> = await res.json();
  if (!json.success) throw new Error(json.error || "요청에 실패했습니다.");
  return json.data as T;
}

interface CommunityFromAPI extends Omit<Community, "id"> {
  _id: string;
}

function normalize(c: CommunityFromAPI): Community {
  return {
    id: c._id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    theme: c.theme,
    logoUrl: c.logoUrl,
    ownerId: c.ownerId,
    memberCount: c.memberCount,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  };
}

export async function fetchCommunitiesByOwner(ownerId: string): Promise<Community[]> {
  const list = await apiFetch<CommunityFromAPI[]>(`/api/communities?ownerId=${ownerId}`);
  return list.map(normalize);
}

export async function fetchCommunityBySlug(slug: string): Promise<Community | null> {
  try {
    const c = await apiFetch<CommunityFromAPI>(`/api/communities/${slug}`);
    return normalize(c);
  } catch {
    return null;
  }
}

export async function createCommunityAPI(
  form: CreateCommunityForm,
  ownerId: string
): Promise<Community> {
  const c = await apiFetch<CommunityFromAPI>("/api/communities", {
    method: "POST",
    body: JSON.stringify({ ...form, ownerId }),
  });
  return normalize(c);
}

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  const result = await apiFetch<{ available: boolean }>(`/api/communities/check-slug?slug=${slug}`);
  return result.available;
}

interface BoardFromAPI extends Omit<Board, "id" | "communityId"> {
  _id: string;
  communityId: string;
}

function normalizeBoard(b: BoardFromAPI): Board {
  return {
    id: b._id,
    communityId: b.communityId,
    name: b.name,
    description: b.description,
    type: b.type,
    order: b.order,
    createdAt: b.createdAt,
  };
}

export async function fetchBoardsBySlug(slug: string): Promise<Board[]> {
  const list = await apiFetch<BoardFromAPI[]>(`/api/communities/${slug}/boards`);
  return list.map(normalizeBoard);
}
