"use client";

import { useMemo, useState } from "react";
import { Bell, Plus, Send, Trash2, Pin, PinOff, Pencil } from "lucide-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormError from "@/components/ui/FormError";
import { useCommunity } from "@/hooks/useCommunity";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import type { Board, Post } from "@/types";
import {
  useBoardsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  usePostListQuery,
  useTogglePinMutation,
  useUpdatePostMutation,
} from "@/queries/hooks";

const TITLE_MAX = 60;
const CONTENT_MAX = 2000;

export default function AdminNoticesPage() {
  const community = useCommunity();
  const { user } = useAuth();
  const toast = useToast();

  const { data: boards = [] } = useBoardsQuery(community.slug);
  const noticeBoard: Board | null = useMemo(() => boards.find((b) => b.type === "notice") ?? null, [boards]);
  const { data: notices } = usePostListQuery(
    community.slug,
    { boardId: noticeBoard?.id, limit: 50 },
    { enabled: !!noticeBoard?.id }
  );
  const posts: Post[] = notices?.posts ?? [];
  const createMutation = useCreatePostMutation(community.slug);
  const deleteMutation = useDeletePostMutation(community.slug);
  const togglePinMutation = useTogglePinMutation(community.slug);
  const updateMutation = useUpdatePostMutation(community.slug);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [touched, setTouched] = useState({ title: false, content: false });
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTouched, setEditTouched] = useState({ title: false, content: false });

  const handleSubmit = async () => {
    setTouched({ title: true, content: true });
    if (titleError || contentError) {
      toast.error("입력값을 확인해주세요.");
      return;
    }
    if (!noticeBoard || !user) return;
    try {
      await createMutation.mutateAsync({ boardId: noticeBoard.id, title, content });
      toast.success("공지가 등록되었습니다.");
      setShowForm(false);
      setTitle("");
      setContent("");
    } catch {
      toast.error("등록에 실패했습니다.");
    }
  };

  const titleError =
    !title.trim() ? "제목을 입력해주세요." : title.length > TITLE_MAX ? `제목은 최대 ${TITLE_MAX}자입니다.` : "";
  const contentError =
    !content.trim() ? "내용을 입력해주세요." : content.length > CONTENT_MAX ? `내용은 최대 ${CONTENT_MAX}자입니다.` : "";

  const handleDelete = async (post: Post) => {
    if (!confirm(`"${post.title}" 공지를 삭제할까요?`)) return;
    try {
      await deleteMutation.mutateAsync(post.id);
      toast.success("공지가 삭제되었습니다.");
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const handleTogglePin = async (post: Post) => {
    try {
      await togglePinMutation.mutateAsync({ postId: post.id, isPinned: !post.isPinned });
      toast.success(post.isPinned ? "고정 해제되었습니다." : "상단에 고정되었습니다.");
    } catch {
      toast.error("고정 상태 변경에 실패했습니다.");
    }
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditTouched({ title: false, content: false });
  };

  const editTitleError =
    !editTitle.trim() ? "제목을 입력해주세요." : editTitle.length > TITLE_MAX ? `제목은 최대 ${TITLE_MAX}자입니다.` : "";
  const editContentError =
    !editContent.trim() ? "내용을 입력해주세요." : editContent.length > CONTENT_MAX ? `내용은 최대 ${CONTENT_MAX}자입니다.` : "";

  const handleEditSubmit = async () => {
    if (!editingPost) return;
    setEditTouched({ title: true, content: true });
    if (editTitleError || editContentError) {
      toast.error("입력값을 확인해주세요.");
      return;
    }
    try {
      await updateMutation.mutateAsync({
        postId: editingPost.id,
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      toast.success("공지가 수정되었습니다.");
      setEditingPost(null);
    } catch {
      toast.error("수정에 실패했습니다.");
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
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontFamily: "inherit",
            fontWeight: 600,
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
            "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)" },
          }}
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
              onClick={handleSubmit} disabled={createMutation.isPending || !!titleError || !!contentError}
              sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}>
              {createMutation.isPending ? "등록 중..." : "공지 등록"}
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
          {posts.map((post) =>
            editingPost?.id === post.id ? (
              <div key={post.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
                <TextField
                  label="공지 제목"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => setEditTouched((t) => ({ ...t, title: true }))}
                  fullWidth
                  size="small"
                  error={editTouched.title && !!editTitleError}
                  helperText={`${editTitle.length}/${TITLE_MAX}`}
                  inputProps={{ maxLength: TITLE_MAX }}
                  slotProps={{ input: { style: { fontFamily: "inherit" } }, formHelperText: { style: { fontFamily: "inherit" } } }}
                />
                <FormError message={editTouched.title ? editTitleError : ""} />
                <TextField
                  label="내용"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onBlur={() => setEditTouched((t) => ({ ...t, content: true }))}
                  fullWidth
                  size="small"
                  multiline
                  minRows={3}
                  error={editTouched.content && !!editContentError}
                  helperText={`${editContent.length}/${CONTENT_MAX}`}
                  inputProps={{ maxLength: CONTENT_MAX }}
                  slotProps={{ input: { style: { fontFamily: "inherit" } }, formHelperText: { style: { fontFamily: "inherit" } } }}
                />
                <FormError message={editTouched.content ? editContentError : ""} />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditingPost(null)}
                    sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit" }}
                  >
                    취소
                  </Button>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleEditSubmit}
                    disabled={updateMutation.isPending || !!editTitleError || !!editContentError}
                    sx={{
                      borderRadius: "10px",
                      textTransform: "none",
                      fontFamily: "inherit",
                      fontWeight: 600,
                      backgroundColor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      "&:hover": { backgroundColor: "color-mix(in srgb, var(--primary) 90%, #000 10%)" },
                    }}
                  >
                    {updateMutation.isPending ? "저장 중..." : "저장"}
                  </Button>
                </div>
              </div>
            ) : (
              <div key={post.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <Bell className="h-4 w-4 shrink-0 text-warning" />
                <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    {post.isPinned && <Pin className="h-3 w-3 shrink-0 text-primary" />}
                    <span className="truncate text-sm font-medium">{post.title}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleTogglePin(post)}
                    disabled={togglePinMutation.isPending}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title={post.isPinned ? "고정 해제" : "상단 고정"}
                    aria-label={post.isPinned ? "고정 해제" : "상단 고정"}
                  >
                    {post.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(post)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    title="수정"
                    aria-label="수정"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(post)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="삭제"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
