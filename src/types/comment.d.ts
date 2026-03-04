import type { User } from "./user";

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  author?: User;
  content: string;
  parentId?: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}
