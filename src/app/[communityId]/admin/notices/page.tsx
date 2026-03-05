"use client";

import { useState } from "react";
import { Bell, Plus, Send } from "lucide-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useCommunity } from "@/hooks/useCommunity";
import { useToast } from "@/hooks/useToast";

export default function AdminNoticesPage() {
  const community = useCommunity();
  const toast = useToast();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    toast.info("공지 기능은 준비 중입니다.");
    setShowForm(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">공지 관리</h1>
          <p className="text-sm text-muted-foreground">커뮤니티 공지사항을 작성하고 관리합니다</p>
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
            fullWidth
            size="small"
            slotProps={{ input: { style: { fontFamily: "inherit" } } }}
          />
          <TextField
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            size="small"
            multiline
            minRows={3}
            slotProps={{ input: { style: { fontFamily: "inherit" } } }}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowForm(false)}
              sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit" }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              size="small"
              startIcon={<Send className="h-3.5 w-3.5" />}
              onClick={handleSubmit}
              sx={{ borderRadius: "10px", textTransform: "none", fontFamily: "inherit", fontWeight: 600 }}
            >
              공지 등록
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16">
        <Bell className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">등록된 공지가 없습니다</p>
      </div>
    </div>
  );
}
