import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, EventModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const events = await EventModel.find({ communityId: community._id.toString() })
      .sort({ startDate: -1 })
      .select("-__v")
      .lean();

    return successResponse(events);
  } catch (e) {
    console.error("[GET events]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function POST(
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

    const body = await request.json();
    const { title, description, location, startDate, endDate, maxParticipants } = body;
    const authorId = auth.userId;

    if (!title || !description || !startDate || !authorId) {
      return errorResponse("필수 항목을 입력해주세요.");
    }

    const event = await EventModel.create({
      communityId: community._id.toString(),
      authorId,
      title,
      description,
      location,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      maxParticipants,
    });

    return successResponse(event, 201);
  } catch (e) {
    console.error("[POST events]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
