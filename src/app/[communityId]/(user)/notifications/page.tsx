"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <h1 className="text-lg font-bold">알림</h1>

      <div className="flex flex-col items-center gap-3 py-16">
        <Bell className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">새로운 알림이 없습니다</p>
        <p className="text-xs text-muted-foreground">공지, 댓글, 모임 소식이 여기에 표시됩니다</p>
      </div>
    </div>
  );
}
