import mongoose, { Schema, type Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  communityId: string;
  type: "notice" | "comment" | "event" | "system";
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: String, required: true },
  communityId: { type: String, required: true },
  type: { type: String, enum: ["notice", "comment", "event", "system"], required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

NotificationSchema.index({ userId: 1, communityId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
