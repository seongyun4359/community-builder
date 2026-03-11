"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Eye, MessageSquare, Pin } from "lucide-react";
import Button from "@mui/material/Button";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import type { Post } from "@/types";
import { useBoardsQuery, usePostListQuery } from "@/queries/hooks";

export default function BoardDetailPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const params = useParams();
  const boardId = params.boardId as string;

  const { data: boards = [] } = useBoardsQuery(community.slug);
  const board = boards.find((b) => b.id === boardId) ?? null;
  const { data: result } = usePostListQuery(community.slug, { boardId });

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={`/${community.slug}/boards`} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-bold">{board?.name || "게시판"}</h1>
        </div>
        {user && (
          <Link href={`/${community.slug}/boards/${boardId}/write`}>
            <Button variant="contained" size="small" startIcon={<Plus className="h-4 w-4" />}
              sx={{ borderRadius: "12px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}>
              글쓰기
            </Button>
          </Link>
        )}
      </div>

      {!result ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />)}
        </div>
      ) : !result.posts.length ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <MessageSquare className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">아직 게시글이 없습니다</p>
          {user && (
            <Link href={`/${community.slug}/boards/${boardId}/write`}
              className="text-sm font-medium text-primary hover:underline">
              첫 게시글을 작성해보세요
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
          {result.posts.map((post) => (
            <PostRow key={post.id} post={post} slug={community.slug} />
          ))}
        </div>
      )}
    </div>
  );
}

function PostRow({ post, slug }: { post: Post; slug: string }) {
  return (
    <Link
      href={`/${slug}/posts/${post.id}`}
      className="flex flex-col gap-1.5 px-4 py-3.5 transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-1.5">
        {post.isPinned && <Pin className="h-3 w-3 text-primary" />}
        <span className="text-sm font-medium leading-snug">{post.title}</span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>{post.author?.nickname || "알 수 없음"}</span>
        <span>{new Date(post.createdAt).toLocaleDateString("ko-KR")}</span>
        <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{post.viewCount}</span>
        <span className="flex items-center gap-0.5"><MessageSquare className="h-3 w-3" />{post.commentCount}</span>
      </div>
    </Link>
  );
}
