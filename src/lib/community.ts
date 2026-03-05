import type { Community, CreateCommunityForm, Board } from "@/types";

const COMMUNITIES_KEY = "community-builder-communities";
const BOARDS_KEY = "community-builder-boards";

export function getStoredCommunities(): Community[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMMUNITIES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeCommunities(communities: Community[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(COMMUNITIES_KEY, JSON.stringify(communities));
}

export function getCommunityBySlug(slug: string): Community | null {
  return getStoredCommunities().find((c) => c.slug === slug) || null;
}

export function getCommunitiesByOwner(ownerId: string): Community[] {
  return getStoredCommunities().filter((c) => c.ownerId === ownerId);
}

export function createCommunity(form: CreateCommunityForm, ownerId: string): Community {
  const communities = getStoredCommunities();

  if (communities.some((c) => c.slug === form.slug)) {
    throw new Error("이미 사용 중인 도메인입니다.");
  }

  const community: Community = {
    id: crypto.randomUUID(),
    slug: form.slug,
    name: form.name,
    description: form.description,
    theme: form.theme,
    ownerId,
    memberCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  storeCommunities([...communities, community]);
  createDefaultBoards(community.id);

  return community;
}

function createDefaultBoards(communityId: string) {
  const boards = getStoredBoards();
  const now = new Date().toISOString();

  const defaults: Board[] = [
    { id: crypto.randomUUID(), communityId, name: "공지사항", type: "notice", order: 0, createdAt: now },
    { id: crypto.randomUUID(), communityId, name: "자유게시판", type: "general", order: 1, createdAt: now },
  ];

  storeBoards([...boards, ...defaults]);
}

export function getStoredBoards(): Board[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function storeBoards(boards: Board[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(BOARDS_KEY, JSON.stringify(boards));
}

export function getBoardsByCommunity(communityId: string): Board[] {
  return getStoredBoards()
    .filter((b) => b.communityId === communityId)
    .sort((a, b) => a.order - b.order);
}

export function isSlugAvailable(slug: string): boolean {
  return !getStoredCommunities().some((c) => c.slug === slug);
}
