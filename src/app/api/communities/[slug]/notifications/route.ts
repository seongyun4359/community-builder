import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, NotificationModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) return errorResponse("userId가 필요합니다.");

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
    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const { userId, notificationId } = await request.json();

    if (notificationId) {
      await NotificationModel.updateOne({ _id: notificationId }, { isRead: true });
    } else if (userId) {
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
