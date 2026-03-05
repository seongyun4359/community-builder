import mongoose, { Schema, type Document } from "mongoose";

export interface ICommunity extends Document {
  slug: string;
  name: string;
  description: string;
  theme: "default" | "minimal" | "vibrant" | "dark" | "nature";
  logoUrl?: string;
  ownerId: string;
  memberCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommunitySchema = new Schema<ICommunity>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    theme: {
      type: String,
      enum: ["default", "minimal", "vibrant", "dark", "nature"],
      default: "default",
    },
    logoUrl: { type: String },
    ownerId: { type: String, required: true },
    memberCount: { type: Number, default: 1 },
  },
  { timestamps: true }
);

CommunitySchema.index({ ownerId: 1 });

export default mongoose.models.Community || mongoose.model<ICommunity>("Community", CommunitySchema);
