"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Avatar from "@mui/material/Avatar";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { user, updateProfile, isLoading } = useAuth();
  const toast = useToast();
  const [nickname, setNickname] = useState<string | null>(null);
  const [error, setError] = useState("");

  const profileImage = user?.profileImage;
  const displayedNickname = nickname ?? user?.nickname ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = displayedNickname.trim();
    if (!trimmed) {
      setError("닉네임을 입력해주세요.");
      return;
    }
    if (trimmed.length < 2 || trimmed.length > 12) {
      setError("닉네임은 2~12자로 입력해주세요.");
      return;
    }

    await updateProfile({ nickname: trimmed, profileImage: profileImage });
    toast.success(`${trimmed}님, 환영합니다!`);
    router.push("/");
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">프로필 설정</h1>
        <p className="text-sm text-muted-foreground">
          커뮤니티에서 사용할 프로필을 설정해주세요
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6"
      >
        {profileImage ? (
          <Image
            src={profileImage}
            alt="프로필"
            width={80}
            height={80}
            className="rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />
        ) : (
          <Avatar
            sx={{
              width: 80,
              height: 80,
              fontSize: "2rem",
              bgcolor: "var(--primary)",
            }}
          >
            {displayedNickname?.[0]?.toUpperCase() ??
              user?.email?.[0]?.toUpperCase() ??
              "?"}
          </Avatar>
        )}

        <div className="w-full">
          <Input
            label="닉네임"
            placeholder="2~12자 닉네임을 입력하세요"
            value={displayedNickname}
            onChange={(e) => setNickname(e.target.value)}
            error={!!error}
            helperText={error || `${displayedNickname.length}/12`}
            slotProps={{ htmlInput: { maxLength: 12 } }}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          disabled={isLoading || !displayedNickname.trim()}
        >
          {isLoading ? "저장 중..." : "시작하기"}
        </Button>
      </form>
    </div>
  );
}
