import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, PostModel, CommentModel, UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; postId: string }> }
) {
  try {
    await connectDB();
    const { slug, postId } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const post = await PostModel.findById(postId).lean();
    if (!post || post.communityId !== community._id.toString()) {
      return errorResponse("게시글을 찾을 수 없습니다.", 404);
    }

    const comments = await CommentModel.find({ postId: post._id })
      .sort({ createdAt: 1 })
      .lean();

    const authorIds = [...new Set(comments.map((c) => c.authorId))];
    const authors = await UserModel.find({ _id: { $in: authorIds } })
      .select("_id nickname profileImage")
      .lean();
    const authorMap = new Map(authors.map((a) => [a._id.toString(), a]));

    const withAuthor = comments.map((c) => ({
      ...c,
      author: authorMap.get(c.authorId) || null,
    }));

    return successResponse(withAuthor);
  } catch (e) {
    console.error("[GET comments]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; postId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    await connectDB();
    const { slug, postId } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const post = await PostModel.findById(postId);
    if (!post || post.communityId !== community._id.toString()) {
      return errorResponse("게시글을 찾을 수 없습니다.", 404);
    }

    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    if (!content) return errorResponse("댓글 내용을 입력해주세요.", 400);
    if (content.length > 500) return errorResponse("댓글은 500자 이내입니다.", 400);

    const comment = await CommentModel.create({
      postId: post._id,
      authorId: auth.userId,
      content,
    });

    post.commentCount = (post.commentCount || 0) + 1;
    await post.save();

    const author = await UserModel.findById(auth.userId)
      .select("_id nickname profileImage")
      .lean();

    return successResponse(
      { ...comment.toObject(), author: author || null },
      201
    );
  } catch (e) {
    console.error("[POST comment]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
