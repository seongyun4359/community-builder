import mongoose, { Schema, type Document, type Types } from "mongoose";

export interface IBoard extends Document {
  communityId: Types.ObjectId;
  name: string;
  description?: string;
  type: "general" | "notice" | "gallery";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const BoardSchema = new Schema<IBoard>(
  {
    communityId: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String },
    type: {
      type: String,
      enum: ["general", "notice", "gallery"],
      default: "general",
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

BoardSchema.index({ communityId: 1, order: 1 });

export default mongoose.models.Board || mongoose.model<IBoard>("Board", BoardSchema);
