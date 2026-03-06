import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PostModel, UserModel } from "@/models";
import { successResponse, errorResponse } from "@/lib/api-utils";
import { requirePostAccess } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; postId: string }> }
) {
  try {
    await connectDB();
    const { postId } = await params;
    const post = await PostModel.findById(postId).select("-__v").lean();
    if (!post) return errorResponse("게시글을 찾을 수 없습니다.", 404);

    await PostModel.updateOne({ _id: postId }, { $inc: { viewCount: 1 } });

    const author = await UserModel.findById(post.authorId)
      .select("_id nickname profileImage")
      .lean();

    return successResponse({ ...post, viewCount: post.viewCount + 1, author });
  } catch (e) {
    console.error("[GET post]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; postId: string }> }
) {
  try {
    await connectDB();
    const { slug, postId } = await params;
    const access = await requirePostAccess(request, slug, postId);
    if ("response" in access) return access.response;
    const body = await request.json();

    const post = await PostModel.findById(postId);
    if (!post) return errorResponse("게시글을 찾을 수 없습니다.", 404);

    const { title, content, images, isPinned } = body;
    const wantsPinOnly =
      isPinned !== undefined && title === undefined && content === undefined && images === undefined;

    if (wantsPinOnly) {
      if (access.ownerId !== access.userId) return errorResponse("권한이 없습니다.", 403);
    } else {
      if (access.postAuthorId !== access.userId && access.ownerId !== access.userId) {
        return errorResponse("권한이 없습니다.", 403);
      }
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (images !== undefined) post.images = images;
    if (isPinned !== undefined) post.isPinned = isPinned;
    await post.save();

    return successResponse(post);
  } catch (e) {
    console.error("[PUT post]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; postId: string }> }
) {
  try {
    await connectDB();
    const { slug, postId } = await params;
    const access = await requirePostAccess(request, slug, postId);
    if ("response" in access) return access.response;

    if (access.postAuthorId !== access.userId && access.ownerId !== access.userId) {
      return errorResponse("권한이 없습니다.", 403);
    }

    const post = await PostModel.findByIdAndDelete(postId);
    if (!post) return errorResponse("게시글을 찾을 수 없습니다.", 404);
    return successResponse({ deleted: true });
  } catch (e) {
    console.error("[DELETE post]", e);
    return errorResponse("서버 오류가 발생했습니다.", 500);
  }
}
