import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get("mode") || "login";

  const kakaoAuthUrl = new URL("https://kauth.kakao.com/oauth/authorize");
  kakaoAuthUrl.searchParams.set("client_id", process.env.KAKAO_REST_API_KEY!);
  kakaoAuthUrl.searchParams.set("redirect_uri", process.env.KAKAO_REDIRECT_URI!);
  kakaoAuthUrl.searchParams.set("response_type", "code");
  kakaoAuthUrl.searchParams.set("state", mode);

  return NextResponse.redirect(kakaoAuthUrl.toString());
}
