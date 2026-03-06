"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/services/post";

export default function WritePostPage() {
  const community = useCommunity();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const router = useRouter();
  const params = useParams();
  const boardId = params.boardId as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || !user) {
    router.replace("/login");
    return null;
  }

  const handleSubmit = async () => {
    if (!title.trim()) { toast.error("제목을 입력해주세요."); return; }
    if (!content.trim()) { toast.error("내용을 입력해주세요."); return; }

    setIsSubmitting(true);
    try {
      const post = await createPost(community.slug, { boardId, title, content }, user.id);
      toast.success("게시글이 등록되었습니다.");
      router.push(`/${community.slug}/posts/${post.id}`);
    } catch {
      toast.error("게시글 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 px-4 py-6">
      <div className="flex items-center gap-2">
        <Link href={`/${community.slug}/boards/${boardId}`} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">글쓰기</h1>
      </div>

      <div className="flex flex-col gap-4">
        <TextField
          label="제목"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          size="small"
          slotProps={{ input: { style: { fontFamily: "inherit" } } }}
        />
        <TextField
          label="내용"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          minRows={8}
          slotProps={{ input: { style: { fontFamily: "inherit" } } }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim()}
          sx={{
            py: 1.5,
            borderRadius: "12px",
            fontFamily: "inherit",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "0.9rem",
          }}
        >
          {isSubmitting ? "등록 중..." : "게시글 등록"}
        </Button>
      </div>
    </div>
  );
}
