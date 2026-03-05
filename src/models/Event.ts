import mongoose, { Schema, type Document } from "mongoose";

export interface IEvent extends Document {
  communityId: string;
  authorId: string;
  title: string;
  description: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  maxParticipants?: number;
  participantCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    communityId: { type: String, required: true },
    authorId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    maxParticipants: { type: Number },
    participantCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

EventSchema.index({ communityId: 1, startDate: -1 });

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
