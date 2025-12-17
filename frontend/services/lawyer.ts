const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export interface Lawyer {
  id: string;
  firstName: string;
  lastName: string;
  fatherName?: string;
  isOnline: boolean;
  lastSeen: string;
}

export interface LawyerChatMessage {
  _id: string;
  sender: string;
  senderRole: 'user' | 'lawyer';
  content: string;
  isRead: boolean;
  createdAt: string;
}

export interface LawyerChatPreview {
  id: string;
  lawyer: {
    id: string;
    firstName: string;
    lastName: string;
    fatherName?: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'active' | 'closed';
}

export interface ClientPreview {
  chatId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fatherName?: string;
    email: string;
    isOnline: boolean;
  };
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  status: 'active' | 'closed';
}

class LawyerService {
  private getHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  // Get all lawyers
  async getLawyers(): Promise<{ success: boolean; data: { lawyers: Lawyer[] } }> {
    const response = await fetch(`${API_BASE_URL}/lawyers`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error fetching lawyers');
    }
    return result;
  }

  // Start or get chat with lawyer
  async startChat(token: string, lawyerId: string): Promise<{
    success: boolean;
    data: {
      chat: {
        id: string;
        lawyerId: string;
        lawyerName: string;
        messages: LawyerChatMessage[];
        lastMessageAt: string;
      };
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/lawyers/${lawyerId}/chat`, {
      method: 'POST',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error starting chat');
    }
    return result;
  }

  // Get user's lawyer chats
  async getUserLawyerChats(token: string): Promise<{
    success: boolean;
    data: { chats: LawyerChatPreview[] };
  }> {
    const response = await fetch(`${API_BASE_URL}/lawyers/user/chats`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error fetching chats');
    }
    return result;
  }

  // Get chat messages
  async getChatMessages(token: string, chatId: string): Promise<{
    success: boolean;
    data: {
      chat: {
        id: string;
        user: { id: string; firstName: string; lastName: string };
        lawyer: { id: string; firstName: string; lastName: string };
        messages: LawyerChatMessage[];
        status: string;
      };
    };
  }> {
    const response = await fetch(`${API_BASE_URL}/lawyers/chats/${chatId}`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error fetching messages');
    }
    return result;
  }

  // LAWYER: Get all clients
  async getClients(token: string): Promise<{
    success: boolean;
    data: { clients: ClientPreview[] };
  }> {
    const response = await fetch(`${API_BASE_URL}/lawyers/dashboard/clients`, {
      method: 'GET',
      headers: this.getHeaders(token),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || 'Error fetching clients');
    }
    return result;
  }
}

export const lawyerService = new LawyerService();

