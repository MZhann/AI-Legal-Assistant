import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { aiService } from '../services/ai.service.js';
import { success, error } from '../utils/response.js';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// In-memory session storage (use Redis in production)
const sessions: Map<string, {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastActivity: Date;
}> = new Map();

// Clean up old sessions every hour
setInterval(() => {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  for (const [sessionId, session] of sessions) {
    if (session.lastActivity < oneHourAgo) {
      sessions.delete(sessionId);
    }
  }
}, 60 * 60 * 1000);

/**
 * Create a new chat session
 */
export const createSession = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
    };
    sessions.set(sessionId, session);

    res.status(201).json(success({
      sessionId,
      message: 'Chat session created successfully',
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Send a message in a chat session
 */
export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json(error('Message is required and must be a non-empty string'));
      return;
    }

    if (message.length > 5000) {
      res.status(400).json(error('Message is too long. Maximum 5000 characters allowed.'));
      return;
    }

    // Check AI service availability
    if (!aiService.isAvailable()) {
      res.status(503).json(error('AI service is temporarily unavailable. Please try again later.'));
      return;
    }

    // Get or create session
    let session = sessions.get(sessionId);
    if (!session) {
      // Auto-create session if not exists
      session = {
        id: sessionId,
        messages: [],
        createdAt: new Date(),
        lastActivity: new Date(),
      };
      sessions.set(sessionId, session);
    }

    // Add user message to history
    session.messages.push({
      role: 'user',
      content: message.trim(),
    });

    // Get AI response with RAG
    const aiResponse = await aiService.chat(message.trim(), session.messages.slice(0, -1));

    // Add assistant response to history
    session.messages.push({
      role: 'assistant',
      content: aiResponse.message,
    });

    // Update last activity
    session.lastActivity = new Date();

    // Keep only last 20 messages to manage context window
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20);
    }

    res.json(success({
      response: aiResponse.message,
      citations: aiResponse.citations,
      usage: aiResponse.usage,
      sessionId: session.id,
      messageCount: session.messages.length,
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Get chat session history
 */
export const getSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      res.status(404).json(error('Session not found'));
      return;
    }

    res.json(success({
      sessionId: session.id,
      messages: session.messages,
      createdAt: session.createdAt,
      lastActivity: session.lastActivity,
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Clear chat session history
 */
export const clearSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      res.status(404).json(error('Session not found'));
      return;
    }

    session.messages = [];
    session.lastActivity = new Date();

    res.json(success({
      sessionId: session.id,
      message: 'Session cleared successfully',
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete chat session
 */
export const deleteSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { sessionId } = req.params;
    
    if (!sessions.has(sessionId)) {
      res.status(404).json(error('Session not found'));
      return;
    }

    sessions.delete(sessionId);

    res.json(success({
      message: 'Session deleted successfully',
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Search Constitution articles
 */
export const searchConstitution = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string') {
      res.status(400).json(error('Query parameter is required'));
      return;
    }

    const articles = await aiService.getConstitutionSummary(query);

    res.json(success({
      query,
      results: articles,
      count: articles.length,
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Check AI service status
 */
export const getStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const isAvailable = aiService.isAvailable();

    res.json(success({
      status: isAvailable ? 'available' : 'unavailable',
      model: 'gemini-1.5-flash',
      features: {
        chat: isAvailable,
        rag: true,
        constitution: true,
      },
    }));
  } catch (err) {
    next(err);
  }
};

