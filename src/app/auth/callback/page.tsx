"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import CircularProgress from "@mui/material/CircularProgress";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUserFromKakao } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const userParam = searchParams.get("user");
    const isSignup = searchParams.get("signup") === "true";

    if (!userParam) {
      router.replace("/login?error=no_user_data");
      return;
    }

    try {
      const kakaoData = JSON.parse(decodeURIComponent(userParam));
      setUserFromKakao(kakaoData);

      if (isSignup || !kakaoData.nickname) {
        router.replace("/signup/profile");
      } else {
        toast.success("로그인되었습니다.");
        router.replace("/");
      }
    } catch {
      router.replace("/login?error=invalid_data");
    }
  }, [searchParams, router, setUserFromKakao, toast]);

  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress size={40} />
        <p className="text-sm text-muted-foreground">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
