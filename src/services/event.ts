import type { CommunityEvent, CreateEventForm } from "@/types";
import { apiFetch, normalizeId } from "./api";

export async function fetchEvents(slug: string): Promise<CommunityEvent[]> {
  const list = await apiFetch<(CommunityEvent & { _id: string })[]>(`/api/communities/${slug}/events`);
  return list.map(normalizeId);
}

export async function createEvent(slug: string, form: CreateEventForm, authorId: string): Promise<CommunityEvent> {
  const data = await apiFetch<CommunityEvent & { _id: string }>(`/api/communities/${slug}/events`, {
    method: "POST",
    body: JSON.stringify({ ...form, authorId }),
  });
  return normalizeId(data);
}
