"use client";

import { useEffect, useState } from "react";
import { Users, FileText, Bell, TrendingUp } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { fetchBoardsBySlug } from "@/services/community";
import type { Board } from "@/types";

export default function AdminDashboardPage() {
  const community = useCommunity();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    fetchBoardsBySlug(community.slug).then(setBoards).catch(() => {});
  }, [community.slug]);

  const stats = [
    { icon: Users, label: "멤버", value: community.memberCount, color: "bg-primary/10 text-primary" },
    { icon: FileText, label: "게시판", value: boards.length, color: "bg-accent text-foreground" },
    { icon: Bell, label: "공지", value: 0, color: "bg-warning/10 text-warning" },
    { icon: TrendingUp, label: "이번 주 게시글", value: 0, color: "bg-success/10 text-success" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">대시보드</h1>
        <p className="text-sm text-muted-foreground">커뮤니티 현황을 한눈에 확인하세요</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className="text-lg font-bold">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">게시판 목록</h2>
        {boards.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            게시판이 없습니다. 게시글 관리에서 추가해보세요.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {boards.map((board) => (
              <div
                key={board.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-3"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{board.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {board.type === "notice" ? "공지사항" : board.type === "gallery" ? "갤러리" : "일반"}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">게시글 0개</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
