import mongoose, { Schema, type Document } from "mongoose";

export interface IPost extends Document {
  communityId: string;
  boardId: mongoose.Types.ObjectId;
  authorId: string;
  title: string;
  content: string;
  images: string[];
  isPinned: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    communityId: { type: String, required: true },
    boardId: { type: Schema.Types.ObjectId, ref: "Board", required: true },
    authorId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    images: [{ type: String }],
    isPinned: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PostSchema.index({ communityId: 1, boardId: 1, createdAt: -1 });
PostSchema.index({ authorId: 1, createdAt: -1 });

export default mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
