import type { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { errorResponse } from "@/lib/api-utils";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";
import { CommunityModel, MemberModel, PostModel } from "@/models";

export async function getAuthUserId(request: NextRequest): Promise<string | null> {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return null;
  const session = await verifySessionToken(token);
  return session?.userId || null;
}

export async function requireAuth(request: NextRequest): Promise<{ userId: string } | Response> {
  const userId = await getAuthUserId(request);
  if (!userId) return errorResponse("로그인이 필요합니다.", 401);
  return { userId };
}

export async function requireCommunity(slug: string) {
  await connectDB();
  const community = await CommunityModel.findOne({ slug });
  if (!community) return { community: null, response: errorResponse("커뮤니티를 찾을 수 없습니다.", 404) };
  return { community, response: null };
}

export async function requireCommunityOwner(
  request: NextRequest,
  slug: string
): Promise<{ userId: string; communityId: string; ownerId: string } | Response> {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { community, response } = await requireCommunity(slug);
  if (response) return response;

  const communityId = community!._id.toString();
  const ownerId = community!.ownerId;
  if (ownerId !== auth.userId) return errorResponse("권한이 없습니다.", 403);

  return { userId: auth.userId, communityId, ownerId };
}

/** 커뮤니티 소유자 또는 admin/super_admin 역할인지 확인 */
export async function requireCommunityAdmin(
  request: NextRequest,
  slug: string
): Promise<{ userId: string; communityId: string; ownerId: string } | Response> {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { community, response } = await requireCommunity(slug);
  if (response) return response;

  const communityId = community!._id.toString();
  const ownerId = community!.ownerId;
  if (ownerId === auth.userId) return { userId: auth.userId, communityId, ownerId };

  const member = await MemberModel.findOne({ communityId, userId: auth.userId }).lean();
  if (!member || !["admin", "super_admin"].includes(member.role)) {
    return errorResponse("권한이 없습니다.", 403);
  }
  return { userId: auth.userId, communityId, ownerId };
}

export async function requirePostAccess(
  request: NextRequest,
  slug: string,
  postId: string
): Promise<
  | { userId: string; communityId: string; ownerId: string; postAuthorId: string }
  | { response: Response; post: null }
> {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return { response: auth, post: null };

  const { community, response } = await requireCommunity(slug);
  if (response) return { response, post: null };

  const post = await PostModel.findById(postId);
  if (!post) return { response: errorResponse("게시글을 찾을 수 없습니다.", 404), post: null };

  const communityId = community!._id.toString();
  if (post.communityId !== communityId) {
    return { response: errorResponse("게시글을 찾을 수 없습니다.", 404), post: null };
  }

  return {
    userId: auth.userId,
    communityId,
    ownerId: community!.ownerId,
    postAuthorId: post.authorId,
  };
}

