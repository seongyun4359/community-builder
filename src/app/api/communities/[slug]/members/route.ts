import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, MemberModel, UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const members = await MemberModel.find({ communityId: community._id.toString() })
      .sort({ joinedAt: 1 })
      .lean();

    const userIds = members.map((m) => m.userId);
    const users = await UserModel.find({ _id: { $in: userIds } })
      .select("_id nickname email profileImage")
      .lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const membersWithUser = members.map((m) => ({
      ...m,
      user: userMap.get(m.userId) || null,
    }));

    return successResponse(membersWithUser);
  } catch (e) {
    console.error("[GET members]", e);
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
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const { userId, role } = await request.json();
    if (!userId || !role) return errorResponse("필수 항목을 입력해주세요.");

    const member = await MemberModel.findOneAndUpdate(
      { communityId: community._id.toString(), userId },
      { role },
      { new: true }
    );
    if (!member) return errorResponse("멤버를 찾을 수 없습니다.", 404);

    return successResponse(member);
  } catch (e) {
    console.error("[PUT members]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
