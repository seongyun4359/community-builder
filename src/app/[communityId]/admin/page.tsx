"use client";

import { Users, FileText, Bell, TrendingUp } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useBoardsQuery, useMembersQuery, usePostListQuery } from "@/queries/hooks";

export default function AdminDashboardPage() {
  const community = useCommunity();
  const { data: boards = [] } = useBoardsQuery(community.slug);
  const { data: members = [] } = useMembersQuery(community.slug);
  const { data: postsData } = usePostListQuery(community.slug, { limit: 1 });
  const noticeBoard = boards.find((b) => b.type === "notice");
  const { data: noticeData } = usePostListQuery(
    community.slug,
    { boardId: noticeBoard?.id, limit: 1 },
    { enabled: !!noticeBoard?.id }
  );

  const memberCount = members.length || community.memberCount;
  const postCount = postsData?.total ?? 0;
  const noticeCount = noticeBoard ? (noticeData?.total ?? 0) : 0;

  const stats = [
    { icon: Users, label: "멤버", value: memberCount, color: "bg-primary/10 text-primary" },
    { icon: FileText, label: "게시글", value: postCount, color: "bg-accent text-foreground" },
    { icon: Bell, label: "공지", value: noticeCount, color: "bg-warning/10 text-warning" },
    { icon: TrendingUp, label: "게시판", value: boards.length, color: "bg-success/10 text-success" },
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
            <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
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
            게시판이 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {boards.map((board) => (
              <div key={board.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium">{board.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {board.type === "notice" ? "공지사항" : board.type === "gallery" ? "갤러리" : "일반"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
