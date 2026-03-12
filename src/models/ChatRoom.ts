import mongoose, { Schema, type Document } from "mongoose";

export interface IChatRoom extends Document {
  communityId: string;
  eventId: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatRoomSchema = new Schema<IChatRoom>(
  {
    communityId: { type: String, required: true },
    eventId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

const Existing = mongoose.models.ChatRoom as mongoose.Model<IChatRoom> | undefined;

// 개발 중 HMR로 인해 예전 스키마(communityId only)가 남아 strict error를 내는 경우가 있어 재생성합니다.
if (Existing && !Existing.schema.path("eventId")) {
  mongoose.deleteModel("ChatRoom");
}

export default (mongoose.models.ChatRoom as mongoose.Model<IChatRoom> | undefined) ||
  mongoose.model<IChatRoom>("ChatRoom", ChatRoomSchema);
