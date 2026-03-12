import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, EventModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; eventId: string }> }
) {
  try {
    await connectDB();
    const { slug, eventId } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const evt = await EventModel.findById(eventId).select("-__v").lean();
    if (!evt) return errorResponse("모임을 찾을 수 없습니다.", 404);
    if ((evt as { communityId: string }).communityId !== community._id.toString()) {
      return errorResponse("모임을 찾을 수 없습니다.", 404);
    }

    return successResponse(evt);
  } catch (e) {
    console.error("[GET event]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

