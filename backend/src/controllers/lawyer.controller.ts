import { Response, NextFunction } from 'express';
import { User, LawyerChat } from '../models/index.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

/**
 * Get all available lawyers
 * GET /lawyers
 */
export const getLawyers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lawyers = await User.find({ role: 'lawyer' })
      .select('firstName lastName fatherName isOnline lastSeen')
      .sort({ isOnline: -1, lastSeen: -1 });

    res.json(success({
      lawyers: lawyers.map(l => ({
        id: l._id,
        firstName: l.firstName,
        lastName: l.lastName,
        fatherName: l.fatherName,
        isOnline: l.isOnline,
        lastSeen: l.lastSeen,
      })),
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Start or get existing chat with a lawyer
 * POST /lawyers/:lawyerId/chat
 */
export const startChatWithLawyer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const { lawyerId } = req.params;

    // Check if lawyer exists
    const lawyer = await User.findOne({ _id: lawyerId, role: 'lawyer' });
    if (!lawyer) {
      res.status(404).json(error('Юрист не найден'));
      return;
    }

    // Find existing chat or create new one
    let chat = await LawyerChat.findOne({
      user: req.user._id,
      lawyer: lawyerId,
    });

    if (!chat) {
      chat = await LawyerChat.create({
        user: req.user._id,
        lawyer: lawyerId,
        messages: [],
      });
    }

    res.json(success({
      chat: {
        id: chat._id,
        lawyerId: lawyer._id,
        lawyerName: `${lawyer.lastName} ${lawyer.firstName}`,
        messages: chat.messages,
        lastMessageAt: chat.lastMessageAt,
      },
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Get user's chats with lawyers
 * GET /user/lawyer-chats
 */
export const getUserLawyerChats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const chats = await LawyerChat.find({ user: req.user._id })
      .populate('lawyer', 'firstName lastName fatherName isOnline')
      .sort({ lastMessageAt: -1 });

    res.json(success({
      chats: chats.map(chat => ({
        id: chat._id,
        lawyer: {
          id: (chat.lawyer as any)._id,
          firstName: (chat.lawyer as any).firstName,
          lastName: (chat.lawyer as any).lastName,
          fatherName: (chat.lawyer as any).fatherName,
          isOnline: (chat.lawyer as any).isOnline,
        },
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount: chat.unreadByUser,
        status: chat.status,
      })),
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Get chat messages
 * GET /lawyer-chats/:chatId
 */
export const getChatMessages = async (
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

    const chat = await LawyerChat.findById(chatId)
      .populate('user', 'firstName lastName')
      .populate('lawyer', 'firstName lastName');

    if (!chat) {
      res.status(404).json(error('Чат не найден'));
      return;
    }

    // Check access
    const isUser = chat.user._id.toString() === req.user._id.toString();
    const isLawyer = chat.lawyer._id.toString() === req.user._id.toString();

    if (!isUser && !isLawyer) {
      res.status(403).json(error('Нет доступа к этому чату'));
      return;
    }

    res.json(success({
      chat: {
        id: chat._id,
        user: {
          id: (chat.user as any)._id,
          firstName: (chat.user as any).firstName,
          lastName: (chat.user as any).lastName,
        },
        lawyer: {
          id: (chat.lawyer as any)._id,
          firstName: (chat.lawyer as any).firstName,
          lastName: (chat.lawyer as any).lastName,
        },
        messages: chat.messages,
        status: chat.status,
      },
    }));
  } catch (err) {
    next(err);
  }
};

// ============ LAWYER SPECIFIC ENDPOINTS ============

/**
 * Get all chats for lawyer (client list)
 * GET /lawyer/clients
 */
export const getLawyerClients = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    if (req.user.role !== 'lawyer') {
      res.status(403).json(error('Только для юристов'));
      return;
    }

    const chats = await LawyerChat.find({ lawyer: req.user._id })
      .populate('user', 'firstName lastName fatherName email isOnline')
      .sort({ lastMessageAt: -1 });

    res.json(success({
      clients: chats.map(chat => ({
        chatId: chat._id,
        user: {
          id: (chat.user as any)._id,
          firstName: (chat.user as any).firstName,
          lastName: (chat.user as any).lastName,
          fatherName: (chat.user as any).fatherName,
          email: (chat.user as any).email,
          isOnline: (chat.user as any).isOnline,
        },
        lastMessage: chat.lastMessage,
        lastMessageAt: chat.lastMessageAt,
        unreadCount: chat.unreadByLawyer,
        status: chat.status,
      })),
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Middleware to check if user is a lawyer
 */
export const requireLawyer = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user) {
    res.status(401).json(error('Не авторизован'));
    return;
  }

  if (req.user.role !== 'lawyer') {
    res.status(403).json(error('Доступ только для юристов'));
    return;
  }

  next();
};

