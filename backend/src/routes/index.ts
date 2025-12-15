import { Router } from 'express';
import healthRoutes from './health.routes.js';

const router = Router();

// Health check routes (outside API prefix for monitoring)
router.use('/health', healthRoutes);

// API v1 routes will be added here
// router.use('/chat', chatRoutes);
// router.use('/documents', documentRoutes);
// router.use('/users', userRoutes);
// router.use('/lawyers', lawyerRoutes);

export default router;

