import { NextRequest, NextResponse } from "next/server";

interface KakaoTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
}

interface KakaoUserResponse {
  id: number;
  kakao_account?: {
    email?: string;
    profile?: {
      nickname?: string;
      profile_image_url?: string;
    };
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "login";
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=kakao_auth_failed`);
  }

  try {
    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY!,
        redirect_uri: process.env.KAKAO_REDIRECT_URI!,
        code,
        ...(process.env.KAKAO_CLIENT_SECRET && {
          client_secret: process.env.KAKAO_CLIENT_SECRET,
        }),
      }),
    });

    const tokenBody = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("[Kakao Token Error]", tokenRes.status, tokenBody);
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`);
    }

    const tokenData = tokenBody as KakaoTokenResponse;

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=user_info_failed`);
    }

    const kakaoUser: KakaoUserResponse = await userRes.json();

    const userData = {
      id: String(kakaoUser.id),
      email: kakaoUser.kakao_account?.email || `kakao_${kakaoUser.id}@kakao.com`,
      nickname: kakaoUser.kakao_account?.profile?.nickname || "",
      profileImage: kakaoUser.kakao_account?.profile?.profile_image_url || "",
      provider: "kakao",
    };

    const userParam = encodeURIComponent(JSON.stringify(userData));
    const params = new URLSearchParams({ user: userParam });
    if (state === "signup") params.set("signup", "true");

    return NextResponse.redirect(`${baseUrl}/auth/callback?${params.toString()}`);
  } catch (e) {
    console.error("[Kakao Callback Error]", e);
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}
