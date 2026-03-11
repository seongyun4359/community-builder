import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, MemberModel, UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireCommunityAdmin, requireCommunityOwner } from "@/lib/api-auth";

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

    const admin = await requireCommunityAdmin(request, slug);
    if (admin instanceof Response) return admin;

    const { userId, role } = await request.json();
    if (!userId || !role) return errorResponse("필수 항목을 입력해주세요.");
    const validRoles = ["super_admin", "admin", "moderator", "member", "guest"];
    if (!validRoles.includes(role)) return errorResponse("올바른 역할이 아닙니다.", 400);

    const communityId = community._id.toString();
    const ownerId = community.ownerId;
    if (userId === ownerId && role !== "super_admin") {
      return errorResponse("소유자 역할은 변경할 수 없습니다.", 403);
    }
    if (role === "super_admin" && admin.userId !== ownerId) {
      return errorResponse("최고 관리자만 이 역할을 부여할 수 있습니다.", 403);
    }

    const member = await MemberModel.findOneAndUpdate(
      { communityId, userId },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const admin = await requireCommunityAdmin(request, slug);
    if (admin instanceof Response) return admin;

    const { userId: targetUserId } = await request.json();
    if (!targetUserId) return errorResponse("멤버를 지정해주세요.");

    const communityId = community._id.toString();
    const ownerId = community.ownerId;

    if (targetUserId === ownerId) {
      return errorResponse("커뮤니티 소유자는 추방할 수 없습니다.", 403);
    }
    if (targetUserId === admin.userId) {
      return errorResponse("본인은 추방할 수 없습니다.", 403);
    }

    const member = await MemberModel.findOneAndDelete({
      communityId,
      userId: targetUserId,
    });
    if (!member) return errorResponse("멤버를 찾을 수 없습니다.", 404);

    await CommunityModel.updateOne(
      { _id: community._id },
      { $inc: { memberCount: -1 } }
    );

    return successResponse({ success: true });
  } catch (e) {
    console.error("[DELETE members]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
