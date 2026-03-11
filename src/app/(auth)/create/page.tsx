"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Check } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import type { CommunityTheme, CreateCommunityForm } from "@/types";
import { useCheckSlugAvailableMutation, useCreateCommunityMutation } from "@/queries/hooks";

const THEMES: { id: CommunityTheme; label: string; color: string; bgImage: string }[] = [
  {
    id: "default",
    label: "기본",
    color: "#00BEFF",
    bgImage: "https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=60",
  },
  {
    id: "minimal",
    label: "미니멀",
    color: "#191f28",
    bgImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=60",
  },
  {
    id: "vibrant",
    label: "비비드",
    color: "#f04452",
    bgImage: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400&q=60",
  },
  {
    id: "dark",
    label: "다크",
    color: "#1a1a2e",
    bgImage: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=60",
  },
  {
    id: "nature",
    label: "자연",
    color: "#2d6a4f",
    bgImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&q=60",
  },
];

const SLUG_REGEX = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

export default function CreateCommunityPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const toast = useToast();
  const checkSlug = useCheckSlugAvailableMutation();
  const createCommunity = useCreateCommunityMutation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("로그인이 필요합니다.");
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router, toast]);

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CreateCommunityForm>({
    slug: "",
    name: "",
    description: "",
    theme: "default",
  });
  const [slugError, setSlugError] = useState("");

  const validateSlugLocal = (value: string): boolean => {
    if (!value) { setSlugError("도메인을 입력해주세요."); return false; }
    if (value.length < 3) { setSlugError("3자 이상 입력해주세요."); return false; }
    if (value.length > 30) { setSlugError("30자 이하로 입력해주세요."); return false; }
    if (!SLUG_REGEX.test(value)) { setSlugError("영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다."); return false; }
    setSlugError("");
    return true;
  };

  const handleNext = async () => {
    if (step === 0) {
      if (!validateSlugLocal(form.slug)) return;
      if (!form.name.trim()) {
        toast.error("커뮤니티 이름을 입력해주세요.");
        return;
      }
      try {
        const available = await checkSlug.mutateAsync(form.slug);
        if (!available) {
          setSlugError("이미 사용 중인 도메인입니다.");
          return;
        }
      } catch {
        toast.error("도메인 확인 중 오류가 발생했습니다.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !user) {
      toast.error("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    try {
      const community = await createCommunity.mutateAsync(form);
      toast.success(`"${community.name}" 커뮤니티가 생성되었습니다!`);
      router.push(`/${community.slug}/admin`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "커뮤니티 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-2xl font-bold">커뮤니티 만들기</h1>
        <p className="text-sm text-muted-foreground">
          {step === 0 ? "기본 정보를 입력해주세요" : "테마를 선택해주세요"}
        </p>
      </div>

      <StepIndicator current={step} total={2} />

      {step === 0 && (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <TextField
              label="도메인 (URL)"
              placeholder="my-community"
              value={form.slug}
              onChange={(e) => {
                const v = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
                setForm((f) => ({ ...f, slug: v }));
                if (slugError) validateSlugLocal(v);
              }}
              error={!!slugError}
              helperText={slugError || `yoursite.com/${form.slug || "my-community"}`}
              fullWidth
              size="small"
              slotProps={{ input: { style: { fontFamily: "inherit" } } }}
            />
          </div>

          <TextField
            label="커뮤니티 이름"
            placeholder="우리 동네 모임"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            fullWidth
            size="small"
            slotProps={{ input: { style: { fontFamily: "inherit" } } }}
          />

          <TextField
            label="소개 (선택)"
            placeholder="커뮤니티를 한 줄로 소개해주세요"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            fullWidth
            size="small"
            multiline
            minRows={2}
            slotProps={{ input: { style: { fontFamily: "inherit" } } }}
          />

          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              mt: 1,
              py: 1.5,
              borderRadius: "12px",
              fontFamily: "inherit",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "0.9rem",
            }}
          >
            다음
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setForm((f) => ({ ...f, theme: theme.id }))}
                className={`relative overflow-hidden rounded-2xl border-2 transition-all ${
                  form.theme === theme.id
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <Image
                  src={theme.bgImage}
                  alt={theme.label}
                  width={200}
                  height={120}
                  className="h-[80px] w-full object-cover"
                />
                <div className="flex items-center gap-2 p-2.5">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: theme.color }}
                  />
                  <span className="text-xs font-medium">{theme.label}</span>
                  {form.theme === theme.id && (
                    <Check className="ml-auto h-4 w-4 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <Button
              variant="outlined"
              onClick={() => setStep(0)}
              sx={{
                flex: 1,
                py: 1.5,
                borderRadius: "12px",
                fontFamily: "inherit",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9rem",
              }}
            >
              이전
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={createCommunity.isPending}
              sx={{
                flex: 2,
                py: 1.5,
                borderRadius: "12px",
                fontFamily: "inherit",
                fontWeight: 600,
                textTransform: "none",
                fontSize: "0.9rem",
              }}
            >
              {createCommunity.isPending ? "생성 중..." : "커뮤니티 생성"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === current ? "w-8 bg-primary" : i < current ? "w-4 bg-primary/50" : "w-4 bg-border"
          }`}
        />
      ))}
    </div>
  );
}
