"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, Eye } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { fetchBoardsBySlug } from "@/services/community";
import type { Board } from "@/types";

export default function AdminPostsPage() {
  const community = useCommunity();
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<string>("all");

  useEffect(() => {
    fetchBoardsBySlug(community.slug).then(setBoards).catch(() => {});
  }, [community.slug]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">게시글 관리</h1>
        <p className="text-sm text-muted-foreground">게시판별 게시글을 관리합니다</p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <FilterChip
          label="전체"
          active={selectedBoard === "all"}
          onClick={() => setSelectedBoard("all")}
        />
        {boards.map((board) => (
          <FilterChip
            key={board.id}
            label={board.name}
            active={selectedBoard === board.id}
            onClick={() => setSelectedBoard(board.id)}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16">
        <FileText className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">아직 게시글이 없습니다</p>
        <p className="text-xs text-muted-foreground">멤버들이 게시글을 작성하면 여기에 표시됩니다</p>
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground hover:bg-border"
      }`}
    >
      {label}
    </button>
  );
}
