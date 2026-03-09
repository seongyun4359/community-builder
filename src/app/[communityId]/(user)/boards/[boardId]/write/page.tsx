"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormError from "@/components/ui/FormError";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { createPost } from "@/services/post";

const TITLE_MAX = 60;
const CONTENT_MAX = 5000;

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
  const [touched, setTouched] = useState({ title: false, content: false });

  if (!isAuthenticated || !user) {
    router.replace("/login");
    return null;
  }

  const titleError =
    !title.trim() ? "제목을 입력해주세요." : title.length > TITLE_MAX ? `제목은 최대 ${TITLE_MAX}자입니다.` : "";
  const contentError =
    !content.trim() ? "내용을 입력해주세요." : content.length > CONTENT_MAX ? `내용은 최대 ${CONTENT_MAX}자입니다.` : "";

  const handleSubmit = async () => {
    setTouched({ title: true, content: true });
    if (titleError || contentError) {
      toast.error("입력값을 확인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const post = await createPost(community.slug, { boardId, title, content });
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
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          fullWidth
          size="small"
          error={touched.title && !!titleError}
          helperText={`${title.length}/${TITLE_MAX}`}
          inputProps={{ maxLength: TITLE_MAX }}
          slotProps={{
            input: { style: { fontFamily: "inherit" } },
            formHelperText: { style: { fontFamily: "inherit" } },
          }}
        />
        <FormError message={touched.title ? titleError : ""} />
        <TextField
          label="내용"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, content: true }))}
          fullWidth
          multiline
          minRows={8}
          error={touched.content && !!contentError}
          helperText={`${content.length}/${CONTENT_MAX}`}
          inputProps={{ maxLength: CONTENT_MAX }}
          slotProps={{
            input: { style: { fontFamily: "inherit" } },
            formHelperText: { style: { fontFamily: "inherit" } },
          }}
        />
        <FormError message={touched.content ? contentError : ""} />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || !!titleError || !!contentError}
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
