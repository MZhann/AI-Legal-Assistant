import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { aiService, AIServiceError, AIErrorCode } from '../services/ai.service.js';
import { success, error } from '../utils/response.js';

type SupportedLang = 'ru' | 'kk' | 'en';

function detectLanguage(text: string): SupportedLang {
  if (/[әіңғүұқөһ]/i.test(text)) return 'kk';
  if (/[а-яё]/i.test(text)) return 'ru';
  return 'en';
}

function getFriendlyAIErrorMessage(
  code: AIErrorCode,
  lang: SupportedLang,
  retryAfterSec?: number
): string {
  const wait = retryAfterSec ? Math.ceil(retryAfterSec) : undefined;
  switch (code) {
    case 'AI_RATE_LIMITED':
      if (lang === 'ru') {
        return wait
          ? `Сервис ИИ временно перегружен (превышен лимит запросов). Попробуйте снова через ~${wait} сек.`
          : 'Сервис ИИ временно перегружен (превышен лимит запросов). Попробуйте снова через минуту.';
      }
      if (lang === 'kk') {
        return wait
          ? `AI қызметі уақытша шамадан тыс жүктелген (сұраныс лимиті асып кетті). ~${wait} сек кейін қайталап көріңіз.`
          : 'AI қызметі уақытша шамадан тыс жүктелген. Бір минуттан кейін қайталап көріңіз.';
      }
      return wait
        ? `AI service is rate-limited. Please retry in ~${wait}s.`
        : 'AI service is rate-limited. Please retry in a minute.';

    case 'AI_AUTH_ERROR':
      if (lang === 'ru') return 'Сервис ИИ не настроен: проверьте OPENAI_API_KEY на сервере.';
      if (lang === 'kk') return 'AI қызметі бапталмаған: серверде OPENAI_API_KEY тексеріңіз.';
      return 'AI service is not configured: check OPENAI_API_KEY on the server.';

    case 'AI_UNAVAILABLE':
      if (lang === 'ru') return 'Сервис ИИ временно недоступен. Попробуйте позже.';
      if (lang === 'kk') return 'AI қызметі уақытша қолжетімсіз. Кейінірек қайталап көріңіз.';
      return 'AI service is temporarily unavailable. Please try again later.';

    case 'AI_BAD_REQUEST':
      if (lang === 'ru') return 'Не удалось обработать запрос. Переформулируйте вопрос.';
      if (lang === 'kk') return 'Сұранысты өңдеу мүмкін болмады. Сұрағыңызды қайта тұжырымдаңыз.';
      return 'Could not process the request. Please rephrase your question.';

    default:
      if (lang === 'ru') return 'Не удалось получить ответ от ИИ. Попробуйте ещё раз.';
      if (lang === 'kk') return 'AI-дан жауап алу мүмкін болмады. Қайталап көріңіз.';
      return 'Failed to get a response from AI. Please try again.';
  }
}

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

    try {
      const aiResponse = await aiService.chat(message.trim(), session.messages.slice(0, -1));

      session.messages.push({
        role: 'assistant',
        content: aiResponse.message,
      });

      session.lastActivity = new Date();

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
    } catch (aiErr) {
      // Roll back the optimistic user message we just pushed so a retry doesn't duplicate it.
      session.messages.pop();

      if (aiErr instanceof AIServiceError) {
        const lang = detectLanguage(message);
        const friendly = getFriendlyAIErrorMessage(aiErr.code, lang, aiErr.retryAfterSec);

        if (aiErr.retryAfterSec) {
          res.setHeader('Retry-After', Math.ceil(aiErr.retryAfterSec).toString());
        }

        res.status(aiErr.statusCode).json(error(friendly, aiErr.code, {
          retryAfterSec: aiErr.retryAfterSec,
        }));
        return;
      }
      throw aiErr;
    }
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
      model: aiService.getActiveModel(),
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

