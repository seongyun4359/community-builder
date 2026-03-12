"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { ArrowLeft, Eye, MessageSquare, Heart, Trash2 } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  useDeletePostMutation,
  usePostQuery,
  usePostLikeQuery,
  useTogglePostLikeMutation,
  useCommentsQuery,
  useCreateCommentMutation,
  useDeleteCommentMutation,
} from "@/queries/hooks";
import type { Comment } from "@/types";

const COMMENT_MAX = 500;

export default function PostDetailPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const { data: post, isLoading, isError } = usePostQuery(community.slug, postId);
  const { data: likeData } = usePostLikeQuery(community.slug, postId, !!user);
  const { data: comments = [] } = useCommentsQuery(community.slug, postId);
  const deleteMutation = useDeletePostMutation(community.slug);
  const toggleLikeMutation = useTogglePostLikeMutation(community.slug, postId);
  const createCommentMutation = useCreateCommentMutation(community.slug, postId);
  const deleteCommentMutation = useDeleteCommentMutation(community.slug, postId);

  const [commentContent, setCommentContent] = useState("");
  const liked = likeData?.liked ?? false;

  useEffect(() => {
    if (!isError) return;
    toast.error("게시글을 찾을 수 없습니다.");
    router.back();
  }, [isError, router, toast]);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const handleDelete = async () => {
    if (!post || !confirm("이 게시글을 삭제할까요?")) return;
    try {
      await deleteMutation.mutateAsync(post.id);
      toast.success("게시글이 삭제되었습니다.");
      router.back();
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("로그인 후 좋아요할 수 있습니다.");
      return;
    }
    try {
      await toggleLikeMutation.mutateAsync();
    } catch {
      toast.error("좋아요 처리에 실패했습니다.");
    }
  };

  const handleSubmitComment = async () => {
    const content = commentContent.trim();
    if (!content) {
      toast.error("댓글 내용을 입력해주세요.");
      return;
    }
    if (content.length > COMMENT_MAX) {
      toast.error(`댓글은 ${COMMENT_MAX}자 이내입니다.`);
      return;
    }
    if (!user) {
      toast.error("로그인 후 댓글을 작성할 수 있습니다.");
      return;
    }
    try {
      await createCommentMutation.mutateAsync(content);
      setCommentContent("");
      toast.success("댓글이 등록되었습니다.");
    } catch {
      toast.error("댓글 등록에 실패했습니다.");
    }
  };

  const handleDeleteComment = async (c: Comment) => {
    if (!confirm("이 댓글을 삭제할까요?")) return;
    try {
      await deleteCommentMutation.mutateAsync(c.id);
      toast.success("댓글이 삭제되었습니다.");
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 px-4 py-6">
        <div className="h-6 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user?.id === post.authorId;
  const isOwner = user?.id === community.ownerId;

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-2 px-4 py-3">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm text-muted-foreground">게시글</span>
      </div>

      <article className="flex flex-col gap-4 px-4 pb-6">
        <h1 className="text-lg font-bold leading-snug">{post.title}</h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {post.author?.profileImage ? (
              <Image src={post.author.profileImage} alt="" width={32} height={32}
                className="rounded-full object-cover" style={{ width: 32, height: 32 }} />
            ) : (
              <Avatar sx={{ width: 32, height: 32, fontSize: "0.75rem", bgcolor: "var(--primary)" }}>
                {post.author?.nickname?.[0]?.toUpperCase() ?? "?"}
              </Avatar>
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{post.author?.nickname || "알 수 없음"}</span>
              <span className="text-[11px] text-muted-foreground">
                {new Date(post.createdAt).toLocaleString("ko-KR", { dateStyle: "medium", timeStyle: "short" })}
              </span>
            </div>
          </div>

          {(isAuthor || isOwner) && (
            <button onClick={handleDelete} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="border-t border-border pt-4">
          <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {post.content}
          </div>
        </div>

        {post.images && post.images.length > 0 && (
          <div className="flex flex-col gap-2">
            {post.images.map((src, i) => (
              <Image key={i} src={src} alt="" width={600} height={400}
                className="w-full rounded-xl object-cover" />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {post.viewCount}
          </span>
          <button
            type="button"
            onClick={handleLike}
            disabled={toggleLikeMutation.isPending}
            className={`flex items-center gap-1 transition-colors hover:text-foreground ${user ? "cursor-pointer" : "cursor-default"}`}
          >
            <Heart
              className={`h-3.5 w-3.5 ${liked ? "fill-primary text-primary" : ""}`}
            />
            {post.likeCount}
          </button>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {post.commentCount}
          </span>
        </div>
      </article>

      <section className="border-t border-border px-4 py-4" id="comments">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          댓글 {comments.length}개
        </h2>
        <div className="flex flex-col gap-3">
          {comments.map((c) => (
            <div
              key={c.id}
              className="flex gap-3 rounded-xl border border-border bg-card p-3"
            >
              {c.author?.profileImage ? (
                <Image
                  src={c.author.profileImage}
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
              ) : (
                <Avatar
                  sx={{ width: 32, height: 32, fontSize: "0.75rem", bgcolor: "var(--primary)" }}
                >
                  {c.author?.nickname?.[0]?.toUpperCase() ?? "?"}
                </Avatar>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {c.author?.nickname || "알 수 없음"}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(c.createdAt).toLocaleString("ko-KR", { dateStyle: "short", timeStyle: "short" })}
                  </span>
                  {(user?.id === c.authorId || isOwner) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(c)}
                      disabled={deleteCommentMutation.isPending}
                      className="ml-auto rounded p-1 text-[11px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    >
                      삭제
                    </button>
                  )}
                </div>
                <p className="mt-0.5 whitespace-pre-wrap text-sm text-foreground">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {user ? (
          <div className="mt-4 flex flex-col gap-2">
            <TextField
              placeholder="댓글을 입력하세요"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              multiline
              minRows={2}
              maxRows={4}
              fullWidth
              size="small"
              inputProps={{ maxLength: COMMENT_MAX }}
              slotProps={{
                input: { style: { fontFamily: "inherit" } },
              }}
              sx={{ "& .MuiInputBase-root": { borderRadius: 2 } }}
            />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">
                {commentContent.length}/{COMMENT_MAX}
              </span>
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmitComment}
                disabled={createCommentMutation.isPending || !commentContent.trim()}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontFamily: "inherit",
                  backgroundColor: "var(--primary)",
                  color: "var(--primary-foreground)",
                  "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)" },
                }}
              >
                {createCommentMutation.isPending ? "등록 중..." : "댓글 등록"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            로그인하면 댓글을 작성할 수 있습니다.
          </p>
        )}
        <div ref={commentsEndRef} />
      </section>
    </div>
  );
}
