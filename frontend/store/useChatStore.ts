import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: {
    lawName: string;
    article: string;
    excerpt?: string;
  }[];
}

interface ChatState {
  // Messages
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearMessages: () => void;

  // Input
  inputValue: string;
  setInputValue: (value: string) => void;

  // Loading state for AI responses
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;

  // Session
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export const useChatStore = create<ChatState>((set) => ({
  // Messages
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
    })),
  clearMessages: () => set({ messages: [], sessionId: null }),

  // Input
  inputValue: "",
  setInputValue: (inputValue) => set({ inputValue }),

  // Typing indicator
  isTyping: false,
  setIsTyping: (isTyping) => set({ isTyping }),

  // Session
  sessionId: null,
  setSessionId: (sessionId) => set({ sessionId }),
}));

