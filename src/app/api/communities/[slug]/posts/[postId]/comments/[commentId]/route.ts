import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { CommunityModel, PostModel, CommentModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requireAuth } from "@/lib/api-auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; postId: string; commentId: string }> }
) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof Response) return auth;

    await connectDB();
    const { slug, postId, commentId } = await params;
    const community = await CommunityModel.findOne({ slug });
    if (!community) return errorResponse("커뮤니티를 찾을 수 없습니다.", 404);

    const post = await PostModel.findById(postId);
    if (!post || post.communityId !== community._id.toString()) {
      return errorResponse("게시글을 찾을 수 없습니다.", 404);
    }

    const comment = await CommentModel.findById(commentId);
    if (!comment || comment.postId.toString() !== postId) {
      return errorResponse("댓글을 찾을 수 없습니다.", 404);
    }

    const isAuthor = comment.authorId === auth.userId;
    const isPostAuthor = post.authorId === auth.userId;
    const isOwner = community.ownerId === auth.userId;
    if (!isAuthor && !isPostAuthor && !isOwner) {
      return errorResponse("권한이 없습니다.", 403);
    }

    await CommentModel.deleteOne({ _id: commentId });
    post.commentCount = Math.max(0, (post.commentCount || 0) - 1);
    await post.save();

    return successResponse({ deleted: true });
  } catch (e) {
    console.error("[DELETE comment]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
