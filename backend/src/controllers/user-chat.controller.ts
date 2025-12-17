import { Response, NextFunction } from 'express';
import { ChatSession } from '../models/index.js';
import { aiService } from '../services/ai.service.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

/**
 * Get all chat sessions for current user
 * GET /user/chats
 */
export const getUserChats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const chats = await ChatSession.find({ user: req.user._id })
      .select('title lastActivity createdAt messages')
      .sort({ lastActivity: -1 });

    // Return chats with message count
    const chatsWithStats = chats.map(chat => ({
      id: chat._id,
      title: chat.title,
      messageCount: chat.messages.length,
      lastActivity: chat.lastActivity,
      createdAt: chat.createdAt,
      preview: chat.messages[0]?.content.substring(0, 100) || '',
    }));

    res.json(success({
      chats: chatsWithStats,
      total: chats.length,
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Create a new chat session
 * POST /user/chats
 */
export const createChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const chat = await ChatSession.create({
      user: req.user._id,
      title: 'Новый чат',
      messages: [],
    });

    res.status(201).json(success({
      chat: {
        id: chat._id,
        title: chat.title,
        createdAt: chat.createdAt,
      },
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Get a specific chat session
 * GET /user/chats/:chatId
 */
export const getChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const { chatId } = req.params;

    const chat = await ChatSession.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      res.status(404).json(error('Чат не найден'));
      return;
    }

    res.json(success({
      chat: {
        id: chat._id,
        title: chat.title,
        messages: chat.messages,
        lastActivity: chat.lastActivity,
        createdAt: chat.createdAt,
      },
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Send a message in a chat session
 * POST /user/chats/:chatId/message
 */
export const sendMessage = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const { chatId } = req.params;
    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json(error('Сообщение обязательно'));
      return;
    }

    if (message.length > 5000) {
      res.status(400).json(error('Сообщение слишком длинное (максимум 5000 символов)'));
      return;
    }

    // Check AI service availability
    if (!aiService.isAvailable()) {
      res.status(503).json(error('AI сервис временно недоступен'));
      return;
    }

    // Find or create chat
    let chat = await ChatSession.findOne({
      _id: chatId,
      user: req.user._id,
    });

    if (!chat) {
      // Create new chat if not found
      chat = await ChatSession.create({
        _id: chatId,
        user: req.user._id,
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        messages: [],
      });
    }

    // Add user message
    chat.messages.push({
      role: 'user',
      content: message.trim(),
      createdAt: new Date(),
    });

    // Get conversation history for context
    const history = chat.messages.slice(-10).map(m => ({
      role: m.role,
      content: m.content,
    }));

    // Get AI response
    const aiResponse = await aiService.chat(message.trim(), history.slice(0, -1));

    // Add assistant message
    chat.messages.push({
      role: 'assistant',
      content: aiResponse.message,
      citations: aiResponse.citations,
      createdAt: new Date(),
    });

    // Update title if it's the first message
    if (chat.messages.length === 2) {
      chat.title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
    }

    await chat.save();

    res.json(success({
      response: aiResponse.message,
      citations: aiResponse.citations,
      usage: aiResponse.usage,
      chatId: chat._id,
      messageCount: chat.messages.length,
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a chat session
 * DELETE /user/chats/:chatId
 */
export const deleteChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const { chatId } = req.params;

    const result = await ChatSession.deleteOne({
      _id: chatId,
      user: req.user._id,
    });

    if (result.deletedCount === 0) {
      res.status(404).json(error('Чат не найден'));
      return;
    }

    res.json(success({ message: 'Чат удален' }));
  } catch (err) {
    next(err);
  }
};

/**
 * Update chat title
 * PATCH /user/chats/:chatId
 */
export const updateChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const { chatId } = req.params;
    const { title } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json(error('Название обязательно'));
      return;
    }

    const chat = await ChatSession.findOneAndUpdate(
      { _id: chatId, user: req.user._id },
      { title: title.trim().substring(0, 200) },
      { new: true }
    );

    if (!chat) {
      res.status(404).json(error('Чат не найден'));
      return;
    }

    res.json(success({
      chat: {
        id: chat._id,
        title: chat.title,
      },
    }));
  } catch (err) {
    next(err);
  }
};

