import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "cb_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getSessionSecret() {
  const secret = process.env.AUTH_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    throw new Error("AUTH_SECRET 환경변수가 필요합니다.");
  }
  return "dev-insecure-auth-secret";
}

function getKey() {
  return new TextEncoder().encode(getSessionSecret());
}

export function getSessionCookieName() {
  return SESSION_COOKIE;
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export async function createSessionToken(userId: string) {
  const now = Math.floor(Date.now() / 1000);
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt(now)
    .setExpirationTime(now + SESSION_TTL_SECONDS)
    .sign(getKey());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getKey());
    const userId = payload.sub;
    if (!userId) return null;
    return { userId };
  } catch {
    return null;
  }
}

