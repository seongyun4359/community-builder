"use client";

import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import { Crown, Shield, Users } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { Skeleton } from "@/components/ui/Loading";
import { useMembersQuery } from "@/queries/hooks";

const ROLE_LABELS: Record<string, string> = {
  super_admin: "최고 관리자",
  admin: "관리자",
  moderator: "운영진",
  member: "멤버",
  guest: "게스트",
};

export default function MembersPage() {
  const community = useCommunity();
  const { data: members = [], isLoading } = useMembersQuery(community.slug);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 px-4 py-6">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">멤버</h1>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" />
          {members.length}명
        </span>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <Users className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">멤버가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {members.map((m) => {
            return (
              <div key={m.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                {m.user?.profileImage ? (
                  <Image src={m.user.profileImage} alt="" width={40} height={40}
                    className="rounded-full object-cover" style={{ width: 40, height: 40 }} />
                ) : (
                  <Avatar sx={{ width: 40, height: 40, fontSize: "0.875rem", bgcolor: "var(--primary)" }}>
                    {m.user?.nickname?.[0]?.toUpperCase() ?? "?"}
                  </Avatar>
                )}
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{m.user?.nickname || m.user?.email || "알 수 없음"}</span>
                    {m.role === "super_admin" && <Crown className="h-3.5 w-3.5 text-warning" />}
                    {m.role === "admin" && <Shield className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{ROLE_LABELS[m.role] || m.role}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
