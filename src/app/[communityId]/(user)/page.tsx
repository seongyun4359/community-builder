"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Bell, Users, CalendarDays } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { fetchBoardsBySlug } from "@/services/community";
import type { Board } from "@/types";

export default function CommunityHomePage() {
  const community = useCommunity();
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    fetchBoardsBySlug(community.slug).then(setBoards).catch(() => {});
  }, [community.slug]);

  return (
    <div className="flex flex-col gap-6 px-4 py-6">
      <section className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">{community.name}</h1>
        {community.description && (
          <p className="text-sm text-muted-foreground">{community.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            멤버 {community.memberCount}명
          </span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">빠른 메뉴</h2>
        <div className="grid grid-cols-4 gap-2">
          <QuickMenu icon={<FileText className="h-5 w-5" />} label="게시판" href={`/${community.slug}/boards`} />
          <QuickMenu icon={<Bell className="h-5 w-5" />} label="공지" href={`/${community.slug}/boards`} />
          <QuickMenu icon={<CalendarDays className="h-5 w-5" />} label="모임" href={`/${community.slug}/events`} />
          <QuickMenu icon={<Users className="h-5 w-5" />} label="멤버" href={`/${community.slug}/members`} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-muted-foreground">게시판</h2>
        {boards.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            아직 게시판이 없습니다.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {boards.map((board) => (
              <Link
                key={board.id}
                href={`/${community.slug}/boards/${board.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <FileText className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold">{board.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {board.type === "notice" ? "공지사항" : board.type === "gallery" ? "갤러리" : "일반 게시판"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function QuickMenu({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-muted"
    >
      <span className="text-primary">{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
