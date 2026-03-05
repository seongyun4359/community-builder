import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug }).select("-__v").lean();
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);
    return successResponse(community);
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const body = await request.json();

    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const { name, description, theme, logoUrl } = body;
    if (name !== undefined) community.name = name;
    if (description !== undefined) community.description = description;
    if (theme !== undefined) community.theme = theme;
    if (logoUrl !== undefined) community.logoUrl = logoUrl;
    await community.save();

    return successResponse(community);
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
