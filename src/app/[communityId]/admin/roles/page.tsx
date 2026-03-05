"use client";

import { useEffect, useState } from "react";
import { Shield, ChevronRight } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { fetchMembers } from "@/services/member";
import type { Member } from "@/types";

const ROLE_CONFIG = [
  { id: "super_admin", label: "최고 관리자", description: "모든 권한 보유, 커뮤니티 삭제 가능", color: "bg-destructive/10 text-destructive" },
  { id: "admin", label: "관리자", description: "게시글/멤버 관리, 공지 작성", color: "bg-primary/10 text-primary" },
  { id: "moderator", label: "운영진", description: "게시글 관리, 신고 처리", color: "bg-warning/10 text-warning" },
  { id: "member", label: "일반 멤버", description: "게시글 작성, 댓글 작성", color: "bg-success/10 text-success" },
  { id: "guest", label: "게스트", description: "읽기 전용", color: "bg-muted text-muted-foreground" },
] as const;

export default function AdminRolesPage() {
  const community = useCommunity();
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    fetchMembers(community.slug).then(setMembers).catch(() => {});
  }, [community.slug]);

  const roleCounts = ROLE_CONFIG.map((role) => ({
    ...role,
    count: members.filter((m) => m.role === role.id).length,
  }));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">권한 관리</h1>
        <p className="text-sm text-muted-foreground">전체 멤버 {members.length}명</p>
      </div>

      <div className="flex flex-col gap-2">
        {roleCounts.map((role) => (
          <button
            key={role.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${role.color}`}>
              <Shield className="h-5 w-5" />
            </div>
            <div className="flex flex-1 flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{role.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {role.count}명
                </span>
              </div>
              <span className="text-xs text-muted-foreground">{role.description}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
