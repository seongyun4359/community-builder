"use client";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useCommunity } from "@/hooks/useCommunity";
import { useToast } from "@/hooks/useToast";
import type { CommunityTheme } from "@/types";

const THEMES: { id: CommunityTheme; label: string; color: string }[] = [
  { id: "default", label: "기본", color: "#00BEFF" },
  { id: "minimal", label: "미니멀", color: "#191f28" },
  { id: "vibrant", label: "비비드", color: "#f04452" },
  { id: "dark", label: "다크", color: "#1a1a2e" },
  { id: "nature", label: "자연", color: "#2d6a4f" },
];

export default function AdminSettingsPage() {
  const community = useCommunity();
  const toast = useToast();

  const [name, setName] = useState(community.name);
  const [description, setDescription] = useState(community.description);
  const [theme, setTheme] = useState<CommunityTheme>(community.theme);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("커뮤니티 이름을 입력해주세요.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/communities/${community.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, theme }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      toast.success("설정이 저장되었습니다.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-bold">커뮤니티 설정</h1>
        <p className="text-sm text-muted-foreground">기본 정보와 테마를 변경합니다</p>
      </div>

      <section className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">기본 정보</h2>
        <TextField
          label="커뮤니티 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          size="small"
          slotProps={{ input: { style: { fontFamily: "inherit" } } }}
        />
        <TextField
          label="소개"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          size="small"
          multiline
          minRows={2}
          slotProps={{ input: { style: { fontFamily: "inherit" } } }}
        />
        <div className="text-xs text-muted-foreground">
          도메인: <span className="font-mono font-medium text-foreground">/{community.slug}</span>
        </div>
      </section>

      <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">테마</h2>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-xs font-medium transition-all ${
                theme === t.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-muted-foreground/30"
              }`}
            >
              <div className="h-4 w-4 rounded-full" style={{ backgroundColor: t.color }} />
              {t.label}
            </button>
          ))}
        </div>
      </section>

      <Button
        variant="contained"
        onClick={handleSave}
        disabled={isSaving}
        sx={{
          py: 1.5,
          borderRadius: "12px",
          fontFamily: "inherit",
          fontWeight: 600,
          textTransform: "none",
          fontSize: "0.9rem",
        }}
      >
        {isSaving ? "저장 중..." : "변경사항 저장"}
      </Button>
    </div>
  );
}
