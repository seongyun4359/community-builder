export type NotificationType = "notice" | "comment" | "event" | "system";

export interface Notification {
  id: string;
  userId: string;
  communityId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}
