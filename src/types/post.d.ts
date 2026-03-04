import type { User } from "./user";

export interface Post {
  id: string;
  boardId: string;
  authorId: string;
  author?: User;
  title: string;
  content: string;
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}
