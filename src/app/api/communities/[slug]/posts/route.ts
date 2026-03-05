import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, PostModel, UserModel } from "@/models";
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

    const { searchParams } = request.nextUrl;
    const boardId = searchParams.get("boardId");
    const authorId = searchParams.get("authorId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const filter: Record<string, unknown> = { communityId: community._id.toString() };
    if (boardId) filter.boardId = boardId;
    if (authorId) filter.authorId = authorId;

    const [posts, total] = await Promise.all([
      PostModel.find(filter)
        .sort({ isPinned: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-__v")
        .lean(),
      PostModel.countDocuments(filter),
    ]);

    const authorIds = [...new Set(posts.map((p) => p.authorId))];
    const authors = await UserModel.find({ _id: { $in: authorIds } })
      .select("_id nickname profileImage")
      .lean();
    const authorMap = new Map(authors.map((a) => [a._id.toString(), a]));

    const postsWithAuthor = posts.map((p) => ({
      ...p,
      author: authorMap.get(p.authorId) || null,
    }));

    return successResponse({ posts: postsWithAuthor, total, page, limit });
  } catch (e) {
    console.error("[GET posts]", e);
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
    const { boardId, title, content, images, authorId } = body;

    if (!boardId || !title || !content || !authorId) {
      return errorResponse("필수 항목을 입력해주세요.");
    }

    const post = await PostModel.create({
      communityId: community._id.toString(),
      boardId,
      authorId,
      title,
      content,
      images: images || [],
    });

    return successResponse(post, 201);
  } catch (e) {
    console.error("[POST posts]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
