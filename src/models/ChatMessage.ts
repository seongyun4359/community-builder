import mongoose, { Schema, type Document } from "mongoose";

export interface IChatMessage extends Document {
  roomId: string;
  senderId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    roomId: { type: String, required: true },
    senderId: { type: String, required: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ roomId: 1, createdAt: -1 });

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>("ChatMessage", ChatMessageSchema);
