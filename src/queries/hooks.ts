"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/queries/keys";
import { checkSlugAvailable, createCommunityAPI, fetchBoardsBySlug, fetchCommunitiesByOwner, fetchCommunityBySlug } from "@/services/community";
import { fetchPosts, fetchPost, createPost, deletePost, togglePin, type PostListResult } from "@/services/post";
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
import { fetchMe } from "@/services/auth";
import type { Community, Board, Post, Notification, User, UserRole } from "@/types";
import type { CommunityEvent, CreateCommunityForm, CreateEventForm, CreatePostForm } from "@/types";
import type { CreateInvitationResult } from "@/types/invitation";

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

