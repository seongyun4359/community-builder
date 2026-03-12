import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { ChatRoomModel, ChatMessageModel, EventModel, UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireCommunityMember } from "@/lib/api-auth";

const MESSAGE_LIMIT = 50;

export async function GET(
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

    const roomDoc = await ChatRoomModel.findOneAndUpdate(
      { eventId },
      { $setOnInsert: { communityId, eventId } },
      { upsert: true, new: true }
    ).lean();
    const room = roomDoc!;

    const roomId = (room as { _id: { toString: () => string } })._id.toString();
    const messages = await ChatMessageModel.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(MESSAGE_LIMIT)
      .lean();

    const senderIds = [...new Set(messages.map((m) => m.senderId))];
    const users = await UserModel.find({ _id: { $in: senderIds } })
      .select("_id nickname profileImage")
      .lean();
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const messagesWithSender = messages.reverse().map((m) => {
      const msg = m as {
        _id: { toString: () => string };
        senderId: string;
        roomId: string;
        content: string;
        createdAt: Date;
      };
      const sender = userMap.get(msg.senderId);
      return {
        id: msg._id.toString(),
        roomId: msg.roomId,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt.toISOString(),
        sender: sender
          ? {
              id: sender._id.toString(),
              nickname: sender.nickname,
              profileImage: sender.profileImage,
            }
          : undefined,
      };
    });

    return successResponse({
      room: {
        id: roomId,
        communityId,
        createdAt: (room as { createdAt: Date }).createdAt?.toISOString?.() ?? new Date().toISOString(),
        updatedAt: (room as { updatedAt: Date }).updatedAt?.toISOString?.() ?? new Date().toISOString(),
      },
      messages: messagesWithSender,
    });
  } catch (e) {
    console.error("[GET event chat]", e);
    return errorResponse("채팅방을 불러올 수 없습니다.", 500);
  }
}

