"use client";

import { useMemo, useState } from "react";
import { FileText, Trash2, Pin, PinOff, Eye } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useToast } from "@/hooks/useToast";
import type { Post } from "@/types";
import { Skeleton } from "@/components/ui/Loading";
import { useBoardsQuery, useDeletePostMutation, usePostListQuery, useTogglePinMutation } from "@/queries/hooks";

export default function AdminPostsPage() {
  const community = useCommunity();
  const toast = useToast();
  const [selectedBoard, setSelectedBoard] = useState<string>("all");
  const { data: boards = [] } = useBoardsQuery(community.slug);
  const { data: result, isLoading } = usePostListQuery(community.slug, {
    boardId: selectedBoard === "all" ? undefined : selectedBoard,
  });
  const deleteMutation = useDeletePostMutation(community.slug);
  const togglePinMutation = useTogglePinMutation(community.slug);

  const handleDelete = async (post: Post) => {
    if (!confirm(`"${post.title}" 게시글을 삭제할까요?`)) return;
    try {
      await deleteMutation.mutateAsync(post.id);
      toast.success("게시글이 삭제되었습니다.");
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const handleTogglePin = async (post: Post) => {
    try {
      await togglePinMutation.mutateAsync({ postId: post.id, isPinned: !post.isPinned });
      toast.success(post.isPinned ? "고정 해제되었습니다." : "게시글이 고정되었습니다.");
    } catch {
      toast.error("처리에 실패했습니다.");
    }
  };

  const boardMap = useMemo(() => new Map(boards.map((b) => [b.id, b.name])), [boards]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">게시글 관리</h1>
        <p className="text-sm text-muted-foreground">
          전체 {result?.total ?? 0}개의 게시글
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        <FilterChip label="전체" active={selectedBoard === "all"} onClick={() => setSelectedBoard("all")} />
        {boards.map((board) => (
          <FilterChip key={board.id} label={board.name} active={selectedBoard === board.id} onClick={() => setSelectedBoard(board.id)} />
        ))}
      </div>

      {isLoading || !result ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      ) : !result.posts.length ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16">
          <FileText className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">아직 게시글이 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {result.posts.map((post) => (
            <div key={post.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <div className="flex items-center gap-1.5">
                  {post.isPinned && <Pin className="h-3 w-3 shrink-0 text-primary" />}
                  <span className="truncate text-sm font-medium">{post.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{boardMap.get(post.boardId) || "게시판"}</span>
                  <span>&middot;</span>
                  <span>{post.author?.nickname || "알 수 없음"}</span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{post.viewCount}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button onClick={() => handleTogglePin(post)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {post.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </button>
                <button onClick={() => handleDelete(post)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
        active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-border"
      }`}
    >
      {label}
    </button>
  );
}
