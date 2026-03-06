import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return successResponse(null);

  const session = await verifySessionToken(token);
  if (!session) return successResponse(null);

  try {
    await connectDB();
    const user = await UserModel.findById(session.userId).select("-__v").lean();
    if (!user) return successResponse(null);
    return successResponse(user);
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

