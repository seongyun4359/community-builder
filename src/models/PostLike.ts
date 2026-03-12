import mongoose, { Schema, type Document } from "mongoose";

export interface IPostLike extends Document {
  postId: mongoose.Types.ObjectId;
  userId: string;
  createdAt: Date;
}

const PostLikeSchema = new Schema<IPostLike>(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export default mongoose.models.PostLike || mongoose.model<IPostLike>("PostLike", PostLikeSchema);
