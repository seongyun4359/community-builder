import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, InvitationModel, MemberModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/api-auth";

/** 초대 정보 조회 (만료/사용 한도 확인, 커뮤니티 이름 반환) */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await connectDB();
    const { token } = await params;
    if (!token) return errorResponse("초대 링크가 올바르지 않습니다.", 400);

    const invitation = await InvitationModel.findOne({ token }).lean();
    if (!invitation) return errorResponse("유효하지 않거나 만료된 초대입니다.", 404);

    if (new Date() > new Date(invitation.expiresAt)) {
      return errorResponse("만료된 초대입니다.", 410);
    }
    if (invitation.maxUses != null && invitation.usedCount >= invitation.maxUses) {
      return errorResponse("초대 인원이 마감되었습니다.", 410);
    }

    const community = await CommunityModel.findById(invitation.communityId)
      .select("name slug")
      .lean();
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    return successResponse({
      communityName: community.name,
      communitySlug: community.slug,
      role: invitation.role,
      expiresAt: invitation.expiresAt,
    });
  } catch (e) {
    console.error("[GET invites token]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

/** 초대 수락: 로그인 사용자를 해당 커뮤니티 멤버로 추가 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    await connectDB();
    const { token } = await params;
    if (!token) return errorResponse("초대 링크가 올바르지 않습니다.", 400);

    const invitation = await InvitationModel.findOne({ token });
    if (!invitation) return errorResponse("유효하지 않거나 만료된 초대입니다.", 404);

    if (new Date() > new Date(invitation.expiresAt)) {
      return errorResponse("만료된 초대입니다.", 410);
    }
    if (invitation.maxUses != null && invitation.usedCount >= invitation.maxUses) {
      return errorResponse("초대 인원이 마감되었습니다.", 410);
    }

    const community = await CommunityModel.findById(invitation.communityId);
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const communityId = community._id.toString();
    const existing = await MemberModel.findOne({ communityId, userId: auth.userId });
    if (existing) {
      return errorResponse("이미 해당 커뮤니티 멤버입니다.", 409);
    }

    await MemberModel.create({
      communityId,
      userId: auth.userId,
      role: invitation.role,
    });

    invitation.usedCount += 1;
    await invitation.save();

    await CommunityModel.updateOne(
      { _id: community._id },
      { $inc: { memberCount: 1 } }
    );

    return successResponse({
      communitySlug: community.slug,
      communityName: community.name,
    });
  } catch (e) {
    console.error("[POST invites accept]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
