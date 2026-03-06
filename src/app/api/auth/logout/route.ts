import { NextResponse } from "next/server";
import { successResponse } from "@/lib/api-utils";
import { getSessionCookieName } from "@/lib/session";

export async function POST() {
  const res = NextResponse.json(successResponse(true));
  res.cookies.set(getSessionCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return res;
}

