import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, PostModel, PostLikeModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { getAuthUserId, requireAuth } from "@/lib/api-auth";

export async function GET(
  request: NextRequest,
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

    const userId = await getAuthUserId(request);
    const liked = userId
      ? !!(await PostLikeModel.findOne({ postId, userId }).lean())
      : false;

    return successResponse({ liked });
  } catch (e) {
    console.error("[GET post like]", e);
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

    const existing = await PostLikeModel.findOne({ postId, userId: auth.userId });
    if (existing) {
      await PostLikeModel.deleteOne({ _id: existing._id });
      post.likeCount = Math.max(0, post.likeCount - 1);
      await post.save();
      return successResponse({ liked: false, likeCount: post.likeCount });
    }

    await PostLikeModel.create({ postId, userId: auth.userId });
    post.likeCount += 1;
    await post.save();
    return successResponse({ liked: true, likeCount: post.likeCount });
  } catch (e) {
    console.error("[POST post like]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
