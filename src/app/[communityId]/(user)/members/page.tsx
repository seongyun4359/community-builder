"use client";

import Avatar from "@mui/material/Avatar";
import { Crown, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCommunity } from "@/hooks/useCommunity";

export default function MembersPage() {
  const { user } = useAuth();
  const community = useCommunity();

  const isOwner = user?.id === community.ownerId;

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">멤버</h1>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {community.memberCount}명
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {user && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <Avatar sx={{ width: 40, height: 40, fontSize: "0.875rem", bgcolor: "var(--primary)" }}>
              {user.nickname?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
            </Avatar>
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{user.nickname || user.email}</span>
                {isOwner && <Crown className="h-3.5 w-3.5 text-warning" />}
              </div>
              <span className="text-xs text-muted-foreground">
                {isOwner ? "관리자" : "멤버"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
