import type { Notification } from "@/types";
import { apiFetch, normalizeId } from "./api";

export async function fetchNotifications(slug: string, userId: string): Promise<Notification[]> {
  const list = await apiFetch<(Notification & { _id: string })[]>(
    `/api/communities/${slug}/notifications?userId=${userId}`
  );
  return list.map(normalizeId);
}

export async function markAsRead(slug: string, notificationId: string): Promise<void> {
  await apiFetch(`/api/communities/${slug}/notifications`, {
    method: "PUT",
    body: JSON.stringify({ notificationId }),
  });
}

export async function markAllAsRead(slug: string, userId: string): Promise<void> {
  await apiFetch(`/api/communities/${slug}/notifications`, {
    method: "PUT",
    body: JSON.stringify({ userId }),
  });
}
