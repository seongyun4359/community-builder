import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ChatRoomModel, ChatMessageModel, EventModel, UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireCommunityMember } from "@/lib/api-auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; eventId: string }> }
) {
  try {
    const { slug, eventId } = await params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return errorResponse("올바르지 않은 모임 ID입니다.", 400);
    }
    const auth = await requireCommunityMember(request, slug);
    if (auth instanceof Response) return auth;

    await connectDB();

    const event = await EventModel.findById(eventId).lean();
    if (!event) return errorResponse("모임을 찾을 수 없습니다.", 404);
    const communityId = auth.communityId;
    if ((event as { communityId: string }).communityId !== communityId) {
      return errorResponse("모임을 찾을 수 없습니다.", 404);
    }

    const room = await ChatRoomModel.findOneAndUpdate(
      { eventId },
      { $setOnInsert: { communityId, eventId } },
      { upsert: true, new: true }
    );

    const body = await request.json();
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    if (!content) return errorResponse("메시지 내용을 입력해주세요.");

    const roomId = room._id.toString();
    const message = await ChatMessageModel.create({
      roomId,
      senderId: auth.userId,
      content,
    });

    const sender = await UserModel.findById(auth.userId)
      .select("_id nickname profileImage")
      .lean();

    return successResponse(
      {
        id: message._id.toString(),
        roomId,
        senderId: auth.userId,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        sender: sender
          ? {
              id: sender._id.toString(),
              nickname: sender.nickname,
              profileImage: sender.profileImage,
            }
          : undefined,
      },
      201
    );
  } catch (e) {
    console.error("[POST event chat messages]", e);
    return errorResponse("메시지 전송에 실패했습니다.", 500);
  }
}

