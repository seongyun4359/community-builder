"use client";

import { Shield, ChevronRight } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";

const ROLES = [
  {
    id: "super_admin",
    label: "최고 관리자",
    description: "모든 권한 보유, 커뮤니티 삭제 가능",
    color: "bg-destructive/10 text-destructive",
    count: 1,
  },
  {
    id: "admin",
    label: "관리자",
    description: "게시글/멤버 관리, 공지 작성",
    color: "bg-primary/10 text-primary",
    count: 0,
  },
  {
    id: "moderator",
    label: "운영진",
    description: "게시글 관리, 신고 처리",
    color: "bg-warning/10 text-warning",
    count: 0,
  },
  {
    id: "member",
    label: "일반 멤버",
    description: "게시글 작성, 댓글 작성",
    color: "bg-success/10 text-success",
    count: 0,
  },
  {
    id: "guest",
    label: "게스트",
    description: "읽기 전용",
    color: "bg-muted text-muted-foreground",
    count: 0,
  },
];

export default function AdminRolesPage() {
  const community = useCommunity();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">권한 관리</h1>
        <p className="text-sm text-muted-foreground">멤버 등급별 권한을 설정합니다</p>
      </div>

      <div className="flex flex-col gap-2">
        {ROLES.map((role) => (
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
