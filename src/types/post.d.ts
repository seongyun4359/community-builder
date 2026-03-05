import type { User } from "./user";

export interface Post {
  id: string;
  communityId: string;
  boardId: string;
  authorId: string;
  author?: User;
  title: string;
  content: string;
  images?: string[];
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostForm {
  boardId: string;
  title: string;
  content: string;
  images?: string[];
}
