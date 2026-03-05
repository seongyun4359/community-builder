import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  nickname: string;
  profileImage?: string;
  role: "super_admin" | "admin" | "moderator" | "member" | "guest";
  provider: "kakao" | "google";
  providerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    nickname: { type: String, default: "" },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "member", "guest"],
      default: "member",
    },
    provider: { type: String, enum: ["kakao", "google"], required: true },
    providerId: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });
UserSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
