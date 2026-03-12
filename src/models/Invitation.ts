import mongoose, { Schema, type Document } from "mongoose";

export interface IInvitation extends Document {
  communityId: string;
  token: string;
  createdBy: string;
  role: "admin" | "moderator" | "member" | "guest";
  expiresAt: Date;
  maxUses: number | null;
  usedCount: number;
  createdAt: Date;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    communityId: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    createdBy: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "moderator", "member", "guest"],
      default: "member",
    },
    expiresAt: { type: Date, required: true },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

InvitationSchema.index({ communityId: 1, createdBy: 1 });

export default mongoose.models.Invitation || mongoose.model<IInvitation>("Invitation", InvitationSchema);
