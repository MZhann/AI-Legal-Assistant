import { User } from "@/store/useAuthStore";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: {
    message: string;
  };
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  age: number;
  iin: string;
}

interface LoginData {
  email: string;
  password: string;
}

class AuthService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка регистрации');
    }

    return result;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка входа');
    }

    return result;
  }

  async getMe(token: string): Promise<{ success: boolean; data?: { user: User } }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка получения профиля');
    }

    return result;
  }

  async updateProfile(token: string, data: Partial<User>): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'PATCH',
      headers: this.getHeaders(token),
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка обновления профиля');
    }

    return result;
  }

  async changePassword(token: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; data?: { message: string } }> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка смены пароля');
    }

    return result;
  }
}

export const authService = new AuthService();

// Chat service for authenticated users
interface ChatSession {
  id: string;
  title: string;
  messageCount: number;
  lastActivity: string;
  createdAt: string;
  preview: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: {
    article: string;
    title: string;
    excerpt: string;
  }[];
  createdAt: string;
}

class UserChatService {
  private getHeaders(token: string): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async getChats(token: string): Promise<{ success: boolean; data: { chats: ChatSession[]; total: number } }> {
    const response = await fetch(`${API_BASE_URL}/user/chats`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка получения чатов');
    }

    return result;
  }

  async createChat(token: string): Promise<{ success: boolean; data: { chat: { id: string; title: string } } }> {
    const response = await fetch(`${API_BASE_URL}/user/chats`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка создания чата');
    }

    return result;
  }

  async getChat(token: string, chatId: string): Promise<{ success: boolean; data: { chat: { id: string; title: string; messages: ChatMessage[] } } }> {
    const response = await fetch(`${API_BASE_URL}/user/chats/${chatId}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка получения чата');
    }

    return result;
  }

  async sendMessage(token: string, chatId: string, message: string): Promise<{
    success: boolean;
    data: {
      response: string;
      citations: { article: string; title: string; excerpt: string }[];
      chatId: string;
      messageCount: number;
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/user/chats/${chatId}/message`, {
      method: 'POST',
      headers: this.getHeaders(token),
      body: JSON.stringify({ message }),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка отправки сообщения');
    }

    return result;
  }

  async deleteChat(token: string, chatId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/user/chats/${chatId}`, {
      method: 'DELETE',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'Ошибка удаления чата');
    }

    return result;
  }
}

export const userChatService = new UserChatService();

