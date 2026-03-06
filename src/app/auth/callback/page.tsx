"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { fetchMe } from "@/services/auth";
import CircularProgress from "@mui/material/CircularProgress";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();

  useEffect(() => {
    const isSignup = searchParams.get("signup") === "true";

    fetchMe()
      .then((me) => {
        if (!me) {
          router.replace("/login?error=no_session");
          return;
        }

        if (isSignup || !me.nickname) {
          router.replace("/signup/profile");
          return;
        }

        toast.success("로그인되었습니다.");
        router.replace("/");
      })
      .catch(() => {
        router.replace("/login?error=server_error");
      });
  }, [searchParams, router, toast]);

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
