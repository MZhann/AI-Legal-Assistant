import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', protect, getMe);

/**
 * @route   PATCH /auth/me
 * @desc    Update user profile
 * @access  Private
 */
router.patch('/me', protect, updateMe);

/**
 * @route   POST /auth/change-password
 * @desc    Change password
 * @access  Private
 */
router.post('/change-password', protect, changePassword);

export default router;

