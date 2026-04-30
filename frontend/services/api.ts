const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    citations: {
      article: string;
      title: string;
      excerpt: string;
    }[];
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    sessionId: string;
    messageCount: number;
  };
  error?: string;
}

interface SessionResponse {
  success: boolean;
  data: {
    sessionId: string;
    message?: string;
    messages?: {
      role: 'user' | 'assistant';
      content: string;
    }[];
  };
  error?: string;
}

interface StatusResponse {
  success: boolean;
  data: {
    status: 'available' | 'unavailable';
    model: string;
    features: {
      chat: boolean;
      rag: boolean;
      constitution: boolean;
    };
  };
}

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null) as
        | { error?: { message?: string; code?: string; details?: unknown } | string }
        | null;

      let message = `HTTP ${response.status}`;
      let code: string | undefined;
      let details: unknown;

      if (body && body.error) {
        if (typeof body.error === 'string') {
          message = body.error;
        } else {
          if (body.error.message) message = body.error.message;
          code = body.error.code;
          details = body.error.details;
        }
      }

      throw new ApiError(message, response.status, code, details);
    }

    return response.json();
  }

  // Check AI service status
  async getStatus(): Promise<StatusResponse> {
    return this.request<StatusResponse>('/chat/status');
  }

  // Create a new chat session
  async createSession(): Promise<SessionResponse> {
    return this.request<SessionResponse>('/chat/session', {
      method: 'POST',
    });
  }

  // Send a message
  async sendMessage(sessionId: string, message: string): Promise<ChatResponse> {
    return this.request<ChatResponse>(`/chat/session/${sessionId}/message`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  }

  // Get session history
  async getSession(sessionId: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(`/chat/session/${sessionId}`);
  }

  // Clear session
  async clearSession(sessionId: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(`/chat/session/${sessionId}/clear`, {
      method: 'DELETE',
    });
  }

  // Delete session
  async deleteSession(sessionId: string): Promise<SessionResponse> {
    return this.request<SessionResponse>(`/chat/session/${sessionId}`, {
      method: 'DELETE',
    });
  }

  // Search Constitution
  async searchConstitution(query: string): Promise<{
    success: boolean;
    data: {
      query: string;
      results: {
        id: string;
        article: string;
        title: string;
        content: string;
      }[];
      count: number;
    };
  }> {
    return this.request(`/chat/constitution?query=${encodeURIComponent(query)}`);
  }
}

export const apiService = new ApiService();

