export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

export interface Chat {
  id: string;
  title: string;
  pinned: boolean;
  pinnedOrder?: number;
  messages: ChatMessage[];
  createdAt: number;
}
