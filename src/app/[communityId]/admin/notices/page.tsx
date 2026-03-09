"use client";

import { useEffect, useState, useCallback } from "react";
import { Bell, Plus, Send, Trash2 } from "lucide-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormError from "@/components/ui/FormError";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { fetchBoardsBySlug } from "@/services/community";
import { fetchPosts, createPost, deletePost } from "@/services/post";
import type { Board, Post } from "@/types";

const TITLE_MAX = 60;
const CONTENT_MAX = 2000;

export default function AdminNoticesPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const toast = useToast();

  const [noticeBoard, setNoticeBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({ title: false, content: false });

  const loadNotices = useCallback(async () => {
    if (!noticeBoard) return;
    try {
      const data = await fetchPosts(community.slug, { boardId: noticeBoard.id });
      setPosts(data.posts);
    } catch { /* empty */ }
  }, [community.slug, noticeBoard]);

  useEffect(() => {
    fetchBoardsBySlug(community.slug).then((boards) => {
      const nb = boards.find((b) => b.type === "notice");
      setNoticeBoard(nb || null);
    }).catch(() => {});
  }, [community.slug]);

  useEffect(() => {
    loadNotices();
  }, [loadNotices]);

  const handleSubmit = async () => {
    setTouched({ title: true, content: true });
    if (titleError || contentError) {
      toast.error("입력값을 확인해주세요.");
      return;
    }
    if (!noticeBoard || !user) return;

    setIsSubmitting(true);
    try {
      await createPost(community.slug, { boardId: noticeBoard.id, title, content });
      toast.success("공지가 등록되었습니다.");
      setShowForm(false);
      setTitle("");
      setContent("");
      loadNotices();
    } catch {
      toast.error("등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const titleError =
    !title.trim() ? "제목을 입력해주세요." : title.length > TITLE_MAX ? `제목은 최대 ${TITLE_MAX}자입니다.` : "";
  const contentError =
    !content.trim() ? "내용을 입력해주세요." : content.length > CONTENT_MAX ? `내용은 최대 ${CONTENT_MAX}자입니다.` : "";

  const handleDelete = async (post: Post) => {
    if (!confirm(`"${post.title}" 공지를 삭제할까요?`)) return;
    try {
      await deletePost(community.slug, post.id);
      toast.success("공지가 삭제되었습니다.");
      loadNotices();
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">공지 관리</h1>
          <p className="text-sm text-muted-foreground">전체 {posts.length}개의 공지</p>
        </div>
        <Button
          variant="contained"
          size="small"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowForm(!showForm)}
          sx={{ borderRadius: "12px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}
        >
          작성
        </Button>
      </div>

      {showForm && (
        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
          <TextField
            label="공지 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            fullWidth
            size="small"
            error={touched.title && !!titleError}
            helperText={`${title.length}/${TITLE_MAX}`}
            inputProps={{ maxLength: TITLE_MAX }}
            slotProps={{ input: { style: { fontFamily: "inherit" } }, formHelperText: { style: { fontFamily: "inherit" } } }}
          />
          <FormError message={touched.title ? titleError : ""} />
          <TextField
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, content: true }))}
            fullWidth
            size="small"
            multiline
            minRows={3}
            error={touched.content && !!contentError}
            helperText={`${content.length}/${CONTENT_MAX}`}
            inputProps={{ maxLength: CONTENT_MAX }}
            slotProps={{ input: { style: { fontFamily: "inherit" } }, formHelperText: { style: { fontFamily: "inherit" } } }}
          />
          <FormError message={touched.content ? contentError : ""} />
          <div className="flex justify-end gap-2">
            <Button variant="outlined" size="small" onClick={() => setShowForm(false)}
              sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit" }}>
              취소
            </Button>
            <Button variant="contained" size="small" startIcon={<Send className="h-3.5 w-3.5" />}
              onClick={handleSubmit} disabled={isSubmitting || !!titleError || !!contentError}
              sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}>
              {isSubmitting ? "등록 중..." : "공지 등록"}
            </Button>
          </div>
        </div>
      )}

      {posts.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16">
          <Bell className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">등록된 공지가 없습니다</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <div key={post.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <Bell className="h-4 w-4 shrink-0 text-warning" />
              <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                <span className="truncate text-sm font-medium">{post.title}</span>
                <span className="text-[11px] text-muted-foreground">
                  {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                </span>
              </div>
              <button onClick={() => handleDelete(post)} className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
