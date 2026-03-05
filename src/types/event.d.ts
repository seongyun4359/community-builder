export interface CommunityEvent {
  id: string;
  communityId: string;
  authorId: string;
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxParticipants?: number;
  participantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventForm {
  title: string;
  description: string;
  location?: string;
  startDate: string;
  endDate?: string;
  maxParticipants?: number;
}
