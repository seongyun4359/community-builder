import type { ChatRoom, ChatMessage } from "@/types";
import { apiFetch } from "./api";

export interface ChatRoomResult {
  room: ChatRoom;
  messages: ChatMessage[];
}

export async function fetchChat(slug: string, eventId: string): Promise<ChatRoomResult> {
  return apiFetch<ChatRoomResult>(`/api/communities/${slug}/events/${eventId}/chat`);
}

export async function sendMessage(slug: string, eventId: string, content: string): Promise<ChatMessage> {
  return apiFetch<ChatMessage>(`/api/communities/${slug}/events/${eventId}/chat/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}
