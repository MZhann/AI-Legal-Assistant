import { Router } from 'express';
import {
  getUserChats,
  createChat,
  getChat,
  sendMessage,
  deleteChat,
  updateChat,
} from '../controllers/user-chat.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(protect);

/**
 * @route   GET /user/chats
 * @desc    Get all chat sessions for current user
 * @access  Private
 */
router.get('/chats', getUserChats);

/**
 * @route   POST /user/chats
 * @desc    Create a new chat session
 * @access  Private
 */
router.post('/chats', createChat);

/**
 * @route   GET /user/chats/:chatId
 * @desc    Get a specific chat session
 * @access  Private
 */
router.get('/chats/:chatId', getChat);

/**
 * @route   POST /user/chats/:chatId/message
 * @desc    Send a message in a chat session
 * @access  Private
 */
router.post('/chats/:chatId/message', sendMessage);

/**
 * @route   PATCH /user/chats/:chatId
 * @desc    Update chat title
 * @access  Private
 */
router.patch('/chats/:chatId', updateChat);

/**
 * @route   DELETE /user/chats/:chatId
 * @desc    Delete a chat session
 * @access  Private
 */
router.delete('/chats/:chatId', deleteChat);

export default router;

