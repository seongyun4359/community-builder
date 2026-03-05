"use client";

import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { fetchNotifications, markAllAsRead, markAsRead } from "@/services/notification";
import type { Notification } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  notice: "공지",
  comment: "댓글",
  event: "모임",
  system: "시스템",
};

export default function NotificationsPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) { setIsLoading(false); return; }
    fetchNotifications(community.slug, user.id)
      .then(setNotifications)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [community.slug, user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAll = async () => {
    if (!user) return;
    await markAllAsRead(community.slug, user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleRead = async (n: Notification) => {
    if (n.isRead) return;
    await markAsRead(community.slug, n.id);
    setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, isRead: true } : item));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-4 py-6">
        {[1, 2, 3].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">알림</h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} className="flex items-center gap-1 text-xs font-medium text-primary">
            <Check className="h-3.5 w-3.5" />
            모두 읽음
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <Bell className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">새로운 알림이 없습니다</p>
          <p className="text-xs text-muted-foreground">공지, 댓글, 모임 소식이 여기에 표시됩니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleRead(n)}
              className={`flex items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-muted ${
                n.isRead ? "opacity-60" : ""
              }`}
            >
              {!n.isRead && <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {TYPE_LABELS[n.type] || n.type}
                  </span>
                  <span className="text-sm font-medium">{n.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.message}</span>
                <span className="text-[10px] text-muted-foreground">
                  {new Date(n.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
