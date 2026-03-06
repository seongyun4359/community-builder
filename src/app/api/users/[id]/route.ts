import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const user = await UserModel.findById(id).select("-__v");
    if (!user) return errorResponse("유저를 찾을 수 없습니다.", 404);
    return successResponse(user);
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    await connectDB();
    const { id } = await params;
    if (auth.userId !== id) return errorResponse("권한이 없습니다.", 403);
    const body = await request.json();
    const { nickname, profileImage } = body;

    const user = await UserModel.findById(id);
    if (!user) return errorResponse("유저를 찾을 수 없습니다.", 404);

    if (nickname !== undefined) user.nickname = nickname;
    if (profileImage !== undefined) user.profileImage = profileImage;
    await user.save();

    return successResponse(user);
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
