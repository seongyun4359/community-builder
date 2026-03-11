import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, InvitationModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireCommunityAdmin } from "@/lib/api-auth";

const DEFAULT_EXPIRES_DAYS = 7;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST(
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

    const body = await request.json().catch(() => ({}));
    const role = body.role && ["admin", "moderator", "member", "guest"].includes(body.role)
      ? body.role
      : "member";
    const expiresDays = typeof body.expiresDays === "number" ? body.expiresDays : DEFAULT_EXPIRES_DAYS;
    const maxUses = body.maxUses != null && typeof body.maxUses === "number" ? body.maxUses : null;

    const token = randomBytes(24).toString("base64url");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresDays);

    const invitation = await InvitationModel.create({
      communityId: community._id.toString(),
      token,
      createdBy: admin.userId,
      role,
      expiresAt,
      maxUses,
      usedCount: 0,
    });

    const inviteUrl = `${BASE_URL}/join?token=${token}`;

    return successResponse(
      {
        id: invitation._id.toString(),
        token,
        inviteUrl,
        expiresAt: expiresAt.toISOString(),
        role,
        maxUses,
      },
      201
    );
  } catch (e) {
    console.error("[POST invites]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
