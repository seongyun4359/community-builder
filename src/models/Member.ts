import mongoose, { Schema, type Document } from "mongoose";

export interface IMember extends Document {
  communityId: string;
  userId: string;
  role: "super_admin" | "admin" | "moderator" | "member" | "guest";
  joinedAt: Date;
}

const MemberSchema = new Schema<IMember>({
  communityId: { type: String, required: true },
  userId: { type: String, required: true },
  role: {
    type: String,
    enum: ["super_admin", "admin", "moderator", "member", "guest"],
    default: "member",
  },
  joinedAt: { type: Date, default: Date.now },
});

MemberSchema.index({ communityId: 1, userId: 1 }, { unique: true });
MemberSchema.index({ communityId: 1, role: 1 });

export default mongoose.models.Member || mongoose.model<IMember>("Member", MemberSchema);
