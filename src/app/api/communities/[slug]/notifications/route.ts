import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, NotificationModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const userId = auth.userId;

    const notifications = await NotificationModel.find({
      userId,
      communityId: community._id.toString(),
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return successResponse(notifications);
  } catch (e) {
    console.error("[GET notifications]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const { notificationId } = await request.json();
    const userId = auth.userId;

    if (notificationId) {
      await NotificationModel.updateOne({ _id: notificationId, userId }, { isRead: true });
    } else {
      await NotificationModel.updateMany(
        { userId, communityId: community._id.toString(), isRead: false },
        { isRead: true }
      );
    }

    return successResponse({ success: true });
  } catch (e) {
    console.error("[PUT notifications]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
