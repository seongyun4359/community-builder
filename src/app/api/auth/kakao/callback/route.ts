import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models";
import { createSessionToken, getSessionCookieName, getSessionCookieOptions } from "@/lib/session";

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

    await connectDB();

    const kakaoId = String(kakaoUser.id);
    const email = kakaoUser.kakao_account?.email || `kakao_${kakaoId}@kakao.com`;
    const nickname = kakaoUser.kakao_account?.profile?.nickname || "";
    const profileImage = kakaoUser.kakao_account?.profile?.profile_image_url || "";

    let dbUser = await UserModel.findOne({ provider: "kakao", providerId: kakaoId });

    if (dbUser) {
      if (profileImage && !dbUser.profileImage) {
        dbUser.profileImage = profileImage;
        await dbUser.save();
      }
    } else {
      dbUser = await UserModel.create({
        email,
        nickname,
        profileImage,
        role: "super_admin",
        provider: "kakao",
        providerId: kakaoId,
      });
    }

    const userData = {
      id: dbUser._id.toString(),
      email: dbUser.email,
      nickname: dbUser.nickname,
      profileImage: dbUser.profileImage || profileImage,
      provider: "kakao",
    };

    const token = await createSessionToken(userData.id);
    const params = new URLSearchParams();
    if (state === "signup") params.set("signup", "true");

    const res = NextResponse.redirect(`${baseUrl}/auth/callback?${params.toString()}`);
    res.cookies.set(getSessionCookieName(), token, getSessionCookieOptions());
    return res;
  } catch (e) {
    console.error("[Kakao Callback Error]", e);
    return NextResponse.redirect(`${baseUrl}/login?error=server_error`);
  }
}
