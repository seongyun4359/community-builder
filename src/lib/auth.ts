export function getKakaoLoginUrl(mode: "login" | "signup" = "login"): string {
  return `/api/auth/kakao?mode=${mode}`;
}
