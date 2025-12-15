// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  language: "kk" | "ru" | "en";
  createdAt: Date;
}

// Chat types
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  citations?: LawCitation[];
}

export interface LawCitation {
  lawName: string;
  article: string;
  excerpt?: string;
  url?: string;
}

// Document types
export interface DocumentTemplate {
  id: string;
  name: string;
  nameKk: string;
  nameRu: string;
  description: string;
  category: DocumentCategory;
}

export type DocumentCategory = 
  | "complaint"    // Шағым
  | "request"      // Өтініш
  | "statement"    // Арыз
  | "appeal";      // Апелляция

// Lawyer types
export interface Lawyer {
  id: string;
  name: string;
  specialization: string[];
  rating: number;
  credentials: string;
  whatsappLink: string;
  avatarUrl?: string;
}

export interface LawyerChatSession {
  id: string;
  lawyerId: string;
  userId: string;
  messageCount: number;
  isPaid: boolean;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

