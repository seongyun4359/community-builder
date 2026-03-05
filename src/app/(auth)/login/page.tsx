"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import SocialLoginButton from "@/components/ui/SocialLoginButton";
import { getKakaoLoginUrl } from "@/lib/auth";

const errorMessages: Record<string, string> = {
  kakao_auth_failed: "카카오 로그인이 취소되었습니다.",
  token_exchange_failed: "인증 처리 중 오류가 발생했습니다.",
  user_info_failed: "사용자 정보를 가져올 수 없습니다.",
  server_error: "서버 오류가 발생했습니다. 다시 시도해주세요.",
  no_user_data: "로그인 데이터를 받지 못했습니다.",
  invalid_data: "잘못된 로그인 데이터입니다.",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const handleKakaoLogin = () => {
    window.location.href = getKakaoLoginUrl("login");
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-sm text-muted-foreground">
          다시 오신 것을 환영합니다
        </p>
      </div>

      {error && (
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          {errorMessages[error] || "알 수 없는 오류가 발생했습니다."}
        </Alert>
      )}

      <div className="flex flex-col gap-3">
        <SocialLoginButton
          provider="kakao"
          onClick={handleKakaoLogin}
        />
        <SocialLoginButton
          provider="google"
          onClick={() => {}}
          disabled
        />
        <p className="text-center text-xs text-muted-foreground">
          Google 로그인은 준비 중입니다
        </p>
      </div>

      <Divider sx={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
        또는
      </Divider>

      <p className="text-center text-sm text-muted-foreground">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          회원가입
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
