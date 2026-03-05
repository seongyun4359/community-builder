import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) return errorResponse("slug 파라미터가 필요합니다.");

    const existing = await CommunityModel.findOne({ slug }).lean();
    return successResponse({ available: !existing });
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
