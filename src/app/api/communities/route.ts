import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, BoardModel, MemberModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = request.nextUrl;
    const ownerId = searchParams.get("ownerId");

    if (ownerId) {
      const auth = await requireAuth(request);
      if (auth instanceof Response) return auth;
      if (auth.userId !== ownerId) return errorResponse("권한이 없습니다.", 403);
    }

    const filter = ownerId ? { ownerId } : {};
    const communities = await CommunityModel.find(filter)
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    return successResponse(communities);
  } catch (e) {
    console.error("[GET /api/communities]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    await connectDB();
    const body = await request.json();
    const { slug, name, description, theme } = body;
    const ownerId = auth.userId;

    if (!slug || !name || !ownerId) {
      return errorResponse("필수 항목을 입력해주세요.");
    }

    const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!slugRegex.test(slug) || slug.length < 3 || slug.length > 30) {
      return errorResponse("도메인은 영문 소문자, 숫자, 하이픈 3~30자입니다.");
    }

    const existing = await CommunityModel.findOne({ slug });
    if (existing) {
      return errorResponse("이미 사용 중인 도메인입니다.", 409);
    }

    const community = await CommunityModel.create({
      slug,
      name,
      description: description || "",
      theme: theme || "default",
      ownerId,
      memberCount: 1,
    });

    await BoardModel.insertMany([
      { communityId: community._id, name: "공지사항", type: "notice", order: 0 },
      { communityId: community._id, name: "자유게시판", type: "general", order: 1 },
    ]);

    await MemberModel.create({
      communityId: community._id.toString(),
      userId: ownerId,
      role: "super_admin",
    });

    return successResponse(community, 201);
  } catch (e) {
    console.error("[POST /api/communities]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
