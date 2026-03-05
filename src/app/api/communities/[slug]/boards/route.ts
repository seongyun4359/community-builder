import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, BoardModel } from "@/models";
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

    const boards = await BoardModel.find({ communityId: community._id })
      .sort({ order: 1 })
      .select("-__v")
      .lean();

    return successResponse(boards);
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const body = await request.json();
    const { name, description, type } = body;

    if (!name) return errorResponse("게시판 이름을 입력해주세요.");

    const maxOrder = await BoardModel.findOne({ communityId: community._id })
      .sort({ order: -1 })
      .select("order")
      .lean();

    const board = await BoardModel.create({
      communityId: community._id,
      name,
      description,
      type: type || "general",
      order: (maxOrder?.order ?? -1) + 1,
    });

    return successResponse(board, 201);
  } catch {
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
