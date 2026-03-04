"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Divider from "@mui/material/Divider";
import SocialLoginButton from "@/components/ui/SocialLoginButton";
import { useAuth } from "@/hooks/useAuth";
import type { SocialProvider } from "@/types";

export default function SignupPage() {
  const router = useRouter();
  const { loginWithSocial, isLoading } = useAuth();

  const handleSocialSignup = async (provider: SocialProvider) => {
    await loginWithSocial(provider);
    router.push("/signup/profile");
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-8">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">회원가입</h1>
        <p className="text-sm text-muted-foreground">
          커뮤니티를 만들고 관리해보세요
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialSignup("google")}
          disabled={isLoading}
        />
        <SocialLoginButton
          provider="kakao"
          onClick={() => handleSocialSignup("kakao")}
          disabled={isLoading}
        />
      </div>

      <Divider sx={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
        또는
      </Divider>

      <p className="text-center text-sm text-muted-foreground">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
