"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import { ArrowLeft, Eye, MessageSquare, Heart, Trash2 } from "lucide-react";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { useDeletePostMutation, usePostQuery } from "@/queries/hooks";

export default function PostDetailPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;

  const { data: post, isLoading, isError } = usePostQuery(community.slug, postId);
  const deleteMutation = useDeletePostMutation(community.slug);

  useEffect(() => {
    if (!isError) return;
    toast.error("게시글을 찾을 수 없습니다.");
    router.back();
  }, [isError, router, toast]);

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

      <article className="flex flex-col gap-4 px-4 pb-8">
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
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{post.viewCount}</span>
          <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{post.likeCount}</span>
          <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" />{post.commentCount}</span>
        </div>
      </article>
    </div>
  );
}
