"use client";

import Link from "next/link";
import { FileText, Bell, Users, CalendarDays, Eye, MessageSquare, ArrowRight } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import type { Post } from "@/types";
import { useBoardsQuery, usePostListQuery } from "@/queries/hooks";

export default function CommunityHomePage() {
  const community = useCommunity();
  const { data: boards = [] } = useBoardsQuery(community.slug);
  const { data: recent } = usePostListQuery(community.slug, { limit: 5 });
  const recentPosts: Post[] = recent?.posts ?? [];
  const noticeBoard = boards.find((b) => b.type === "notice");

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
          <QuickMenu icon={<Bell className="h-5 w-5" />} label="공지" href={noticeBoard ? `/${community.slug}/boards/${noticeBoard.id}` : `/${community.slug}/boards`} />
          <QuickMenu icon={<CalendarDays className="h-5 w-5" />} label="모임" href={`/${community.slug}/events`} />
          <QuickMenu icon={<Users className="h-5 w-5" />} label="멤버" href={`/${community.slug}/members`} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">최근 게시글</h2>
          {recentPosts.length > 0 && (
            <Link href={`/${community.slug}/boards`} className="flex items-center gap-0.5 text-xs font-medium text-primary">
              전체보기 <ArrowRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        {recentPosts.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border bg-card py-10">
            <FileText className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground">아직 게시글이 없습니다</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
            {recentPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${community.slug}/posts/${post.id}`}
                className="flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-muted/50"
              >
                <span className="text-sm font-medium leading-snug">{post.title}</span>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span>{post.author?.nickname || "알 수 없음"}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
                  <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{post.viewCount}</span>
                  <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{post.commentCount}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
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
