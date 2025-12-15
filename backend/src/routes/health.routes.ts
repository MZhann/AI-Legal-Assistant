import { Router } from 'express';
import { getHealthStatus, ping } from '../controllers/health.controller.js';

const router = Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/', getHealthStatus);

/**
 * @route   GET /health/ping
 * @desc    Simple ping endpoint
 * @access  Public
 */
router.get('/ping', ping);

export default router;

