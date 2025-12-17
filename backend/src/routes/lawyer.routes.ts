import { Router } from 'express';
import {
  getLawyers,
  startChatWithLawyer,
  getUserLawyerChats,
  getChatMessages,
  getLawyerClients,
  requireLawyer,
} from '../controllers/lawyer.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   GET /lawyers
 * @desc    Get all available lawyers
 * @access  Public
 */
router.get('/', getLawyers);

/**
 * @route   POST /lawyers/:lawyerId/chat
 * @desc    Start or get existing chat with a lawyer
 * @access  Private
 */
router.post('/:lawyerId/chat', protect, startChatWithLawyer);

/**
 * @route   GET /user/lawyer-chats
 * @desc    Get user's chats with lawyers
 * @access  Private
 */
router.get('/user/chats', protect, getUserLawyerChats);

/**
 * @route   GET /lawyer-chats/:chatId
 * @desc    Get chat messages
 * @access  Private
 */
router.get('/chats/:chatId', protect, getChatMessages);

/**
 * @route   GET /lawyer/clients
 * @desc    Get all clients for lawyer
 * @access  Private (Lawyer only)
 */
router.get('/dashboard/clients', protect, requireLawyer, getLawyerClients);

export default router;

