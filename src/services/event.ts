import type { CommunityEvent, CreateEventForm } from "@/types";
import { apiFetch, normalizeId } from "./api";

export async function fetchEvents(slug: string): Promise<CommunityEvent[]> {
  const list = await apiFetch<(CommunityEvent & { _id: string })[]>(`/api/communities/${slug}/events`);
  return list.map(normalizeId);
}

export async function fetchEvent(slug: string, eventId: string): Promise<CommunityEvent> {
  const data = await apiFetch<CommunityEvent & { _id: string }>(`/api/communities/${slug}/events/${eventId}`);
  return normalizeId(data);
}

export async function createEvent(slug: string, form: CreateEventForm): Promise<CommunityEvent> {
  const data = await apiFetch<CommunityEvent & { _id: string }>(`/api/communities/${slug}/events`, {
    method: "POST",
    body: JSON.stringify(form),
  });
  return normalizeId(data);
}
