export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: number;
  isAI?: boolean;
}

export interface DoubtQuestion {
  id: string;
  userId: string;
  username: string;
  question: string;
  videoFrame: string; // base64 image string
  videoTime: number; // seconds
  timestamp: number;
  aiResponse?: string;
}

export type ChatMessageWithoutId = Omit<ChatMessage, 'id'>;
export type DoubtQuestionWithoutId = Omit<DoubtQuestion, 'id'>;