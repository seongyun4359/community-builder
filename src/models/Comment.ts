import mongoose, { Schema, type Document } from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  authorId: string;
  content: string;
  parentId?: mongoose.Types.ObjectId;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    authorId: { type: String, required: true },
    content: { type: String, required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "Comment" },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CommentSchema.index({ postId: 1, createdAt: 1 });
CommentSchema.index({ authorId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
