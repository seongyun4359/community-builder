"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/queries/keys";
import { checkSlugAvailable, createCommunityAPI, fetchBoardsBySlug, fetchCommunitiesByOwner, fetchCommunityBySlug } from "@/services/community";
import { fetchPosts, fetchPost, createPost, deletePost, togglePin, updatePost, getPostLike, togglePostLike, type PostListResult } from "@/services/post";
import { fetchComments, createComment, deleteComment } from "@/services/comment";
import { fetchNotifications, markAllAsRead, markAsRead } from "@/services/notification";
import {
  fetchMembers,
  updateMemberRole,
  expelMember,
  createInvite,
  getInviteInfo,
  acceptInvite,
} from "@/services/member";
import { createEvent, fetchEvents } from "@/services/event";
import { fetchEvent } from "@/services/event";
import { fetchChat, sendMessage, type ChatRoomResult } from "@/services/chat";
import { fetchMe } from "@/services/auth";
import type { Community, Board, Post, Notification, User, UserRole, Comment } from "@/types";
import type { CommunityEvent, CreateCommunityForm, CreateEventForm, CreatePostForm } from "@/types";

export function useCommunityQuery(slug: string) {
  return useQuery<Community | null>({
    queryKey: qk.community(slug),
    queryFn: () => fetchCommunityBySlug(slug),
  });
}

export function useMeQuery(options?: { enabled?: boolean }) {
  return useQuery<User | null>({
    queryKey: qk.me,
    queryFn: () => fetchMe(),
    enabled: options?.enabled,
  });
}

export function useCommunitiesByOwnerQuery(ownerId: string, enabled: boolean) {
  return useQuery<Community[]>({
    queryKey: qk.communitiesByOwner(ownerId),
    queryFn: () => fetchCommunitiesByOwner(ownerId),
    enabled,
  });
}

export function useBoardsQuery(slug: string) {
  return useQuery<Board[]>({
    queryKey: qk.boards(slug),
    queryFn: () => fetchBoardsBySlug(slug),
  });
}

export function usePostListQuery(
  slug: string,
  params: { boardId?: string; authorId?: string; page?: number; limit?: number },
  options?: { enabled?: boolean }
) {
  return useQuery<PostListResult>({
    queryKey: qk.postList(slug, params),
    queryFn: () => fetchPosts(slug, params),
    enabled: options?.enabled,
  });
}

export function usePostQuery(slug: string, postId: string) {
  return useQuery<Post>({
    queryKey: qk.post(slug, postId),
    queryFn: () => fetchPost(slug, postId),
  });
}

export function usePostLikeQuery(slug: string, postId: string, enabled: boolean) {
  return useQuery({
    queryKey: qk.postLike(slug, postId),
    queryFn: () => getPostLike(slug, postId),
    enabled: !!slug && !!postId && enabled,
  });
}

export function useCommentsQuery(slug: string, postId: string) {
  return useQuery<Comment[]>({
    queryKey: qk.comments(slug, postId),
    queryFn: () => fetchComments(slug, postId),
    enabled: !!slug && !!postId,
  });
}

export function useNotificationsQuery(slug: string, enabled: boolean) {
  return useQuery<Notification[]>({
    queryKey: qk.notifications(slug),
    queryFn: () => fetchNotifications(slug),
    enabled,
  });
}

export function useMembersQuery(slug: string) {
  return useQuery({
    queryKey: qk.members(slug),
    queryFn: () => fetchMembers(slug),
  });
}

export function useInviteInfoQuery(token: string | null, enabled: boolean) {
  return useQuery({
    queryKey: qk.inviteInfo(token ?? ""),
    queryFn: () => getInviteInfo(token!),
    enabled: !!token && enabled,
  });
}

export function useEventsQuery(slug: string) {
  return useQuery<CommunityEvent[]>({
    queryKey: qk.events(slug),
    queryFn: () => fetchEvents(slug),
  });
}

export function useEventQuery(slug: string, eventId: string, enabled: boolean) {
  return useQuery<CommunityEvent>({
    queryKey: qk.event(slug, eventId),
    queryFn: () => fetchEvent(slug, eventId),
    enabled: !!slug && !!eventId && enabled,
  });
}

export function useChatQuery(slug: string, eventId: string, enabled: boolean) {
  return useQuery<ChatRoomResult>({
    queryKey: qk.chat(slug, eventId),
    queryFn: () => fetchChat(slug, eventId),
    enabled: !!slug && !!eventId && enabled,
  });
}

export function useSendMessageMutation(slug: string, eventId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => sendMessage(slug, eventId, content),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.chat(slug, eventId) });
    },
  });
}

export function useCreatePostMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: CreatePostForm) => createPost(slug, form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts", slug] });
    },
  });
}

export function useCheckSlugAvailableMutation() {
  return useMutation({
    mutationFn: (slug: string) => checkSlugAvailable(slug),
  });
}

export function useCreateCommunityMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: CreateCommunityForm) => createCommunityAPI(form),
    onSuccess: (community) => {
      qc.invalidateQueries({ queryKey: qk.communitiesByOwner(community.ownerId) });
      qc.invalidateQueries({ queryKey: ["communities"] });
    },
  });
}

export function useUpdatePostMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      postId,
      title,
      content,
      images,
    }: {
      postId: string;
      title?: string;
      content?: string;
      images?: string[];
    }) => updatePost(slug, postId, { title, content, images }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["posts", slug] });
      qc.setQueryData(qk.post(slug, updated.id), updated);
    },
  });
}

export function useDeletePostMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => deletePost(slug, postId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts", slug] });
    },
  });
}

export function useTogglePinMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, isPinned }: { postId: string; isPinned: boolean }) => togglePin(slug, postId, isPinned),
    onSuccess: (post) => {
      qc.invalidateQueries({ queryKey: ["posts", slug] });
      qc.setQueryData(qk.post(slug, post.id), post);
    },
  });
}

export function useTogglePostLikeMutation(slug: string, postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => togglePostLike(slug, postId),
    onSuccess: (data) => {
      qc.setQueryData(qk.postLike(slug, postId), { liked: data.liked });
      qc.setQueryData(qk.post(slug, postId), (prev: Post | undefined) =>
        prev ? { ...prev, likeCount: data.likeCount } : prev
      );
    },
  });
}

export function useCreateCommentMutation(slug: string, postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => createComment(slug, postId, content),
    onSuccess: (newComment) => {
      qc.setQueryData<Comment[]>(qk.comments(slug, postId), (prev) => (prev ? [...prev, newComment] : [newComment]));
      qc.setQueryData(qk.post(slug, postId), (prev: Post | undefined) =>
        prev ? { ...prev, commentCount: (prev.commentCount || 0) + 1 } : prev
      );
    },
  });
}

export function useDeleteCommentMutation(slug: string, postId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(slug, postId, commentId),
    onSuccess: (_, commentId) => {
      qc.setQueryData<Comment[]>(qk.comments(slug, postId), (prev) =>
        prev ? prev.filter((c) => c.id !== commentId) : []
      );
      qc.setQueryData(qk.post(slug, postId), (prev: Post | undefined) =>
        prev ? { ...prev, commentCount: Math.max(0, (prev.commentCount || 0) - 1) } : prev
      );
    },
  });
}

export function useMarkAllNotificationsReadMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(slug),
    onSuccess: () => {
      qc.setQueryData<Notification[]>(qk.notifications(slug), (prev) => (prev ?? []).map((n) => ({ ...n, isRead: true })));
    },
  });
}

export function useMarkNotificationReadMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markAsRead(slug, id),
    onSuccess: (_data, id) => {
      qc.setQueryData<Notification[]>(qk.notifications(slug), (prev) => (prev ?? []).map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    },
  });
}

export function useCreateEventMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: CreateEventForm) => createEvent(slug, form),
    onSuccess: (evt) => {
      qc.setQueryData<CommunityEvent[]>(qk.events(slug), (prev) => (prev ? [evt, ...prev] : [evt]));
    },
  });
}

export function useUpdateMemberRoleMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) =>
      updateMemberRole(slug, userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.members(slug) });
    },
  });
}

export function useExpelMemberMutation(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => expelMember(slug, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.members(slug) });
      qc.invalidateQueries({ queryKey: qk.community(slug) });
    },
  });
}

export function useCreateInviteMutation(slug: string) {
  return useMutation({
    mutationFn: (options?: Parameters<typeof createInvite>[1]) => createInvite(slug, options),
  });
}

export function useAcceptInviteMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (token: string) => acceptInvite(token),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: qk.community(data.communitySlug) });
      qc.invalidateQueries({ queryKey: qk.members(data.communitySlug) });
    },
  });
}

