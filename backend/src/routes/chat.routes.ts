import { Router } from 'express';
import {
  createSession,
  sendMessage,
  getSession,
  clearSession,
  deleteSession,
  searchConstitution,
  getStatus,
} from '../controllers/chat.controller.js';

const router = Router();

/**
 * @route   GET /chat/status
 * @desc    Get AI service status
 * @access  Public
 */
router.get('/status', getStatus);

/**
 * @route   GET /chat/constitution
 * @desc    Search Constitution articles
 * @access  Public
 */
router.get('/constitution', searchConstitution);

/**
 * @route   POST /chat/session
 * @desc    Create a new chat session
 * @access  Public
 */
router.post('/session', createSession);

/**
 * @route   GET /chat/session/:sessionId
 * @desc    Get chat session history
 * @access  Public
 */
router.get('/session/:sessionId', getSession);

/**
 * @route   POST /chat/session/:sessionId/message
 * @desc    Send a message in a chat session
 * @access  Public
 */
router.post('/session/:sessionId/message', sendMessage);

/**
 * @route   DELETE /chat/session/:sessionId/clear
 * @desc    Clear chat session history
 * @access  Public
 */
router.delete('/session/:sessionId/clear', clearSession);

/**
 * @route   DELETE /chat/session/:sessionId
 * @desc    Delete chat session
 * @access  Public
 */
router.delete('/session/:sessionId', deleteSession);

export default router;

