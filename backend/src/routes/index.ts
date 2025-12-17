import { Router } from "express";
import healthRoutes from "./health.routes.js";
import chatRoutes from "./chat.routes.js";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import lawyerRoutes from "./lawyer.routes.js";

const router = Router();

// Health check routes (outside API prefix for monitoring)
router.use("/health", healthRoutes);

// Auth routes (register, login, profile)
router.use("/auth", authRoutes);

// Chat routes (AI Legal Consultant - public/anonymous)
router.use("/chat", chatRoutes);

// User routes (authenticated - persistent chats)
router.use("/user", userRoutes);

// Lawyer routes (real lawyer chat)
router.use("/lawyers", lawyerRoutes);

export default router;
