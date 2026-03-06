"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, MessageSquare } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { fetchBoardsBySlug } from "@/services/community";
import type { Board } from "@/types";

export default function BoardsPage() {
  const community = useCommunity();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBoardsBySlug(community.slug)
      .then(setBoards)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [community.slug]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-4 py-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <h1 className="text-lg font-bold">게시판</h1>

      {boards.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">게시판이 아직 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/${community.slug}/boards/${board.id}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent">
                <FileText className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold">{board.name}</span>
                <span className="text-xs text-muted-foreground">
                  {board.type === "notice" ? "공지사항" : board.type === "gallery" ? "갤러리" : "일반 게시판"}
                  {" · "}게시글 {(board as Board & { postCount?: number }).postCount ?? 0}개
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
