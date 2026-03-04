"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import SocialLoginButton from "@/components/ui/SocialLoginButton";
import { useAuth } from "@/hooks/useAuth";
import type { SocialProvider } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const { loginWithSocial, isLoading } = useAuth();

  const handleSocialLogin = async (provider: SocialProvider) => {
    await loginWithSocial(provider);
    const stored = localStorage.getItem("community-builder-auth");
    const user = stored ? JSON.parse(stored) : null;

    if (user && !user.nickname) {
      router.push("/signup/profile");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">로그인</h1>
        <p className="text-sm text-muted-foreground">
          다시 오신 것을 환영합니다
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialLogin("google")}
          disabled={isLoading}
        />
        <SocialLoginButton
          provider="kakao"
          onClick={() => handleSocialLogin("kakao")}
          disabled={isLoading}
        />
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
