export interface ChatRoom {
  id: string;
  communityId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
}

export interface SendMessageForm {
  content: string;
}
