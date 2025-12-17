import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { env } from '../config/index.js';
import { success, error } from '../utils/response.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

/**
 * Generate JWT token
 */
const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, firstName, lastName, fatherName, age, iin } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !age || !iin) {
      res.status(400).json(error('Все обязательные поля должны быть заполнены'));
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { iin }] 
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        res.status(400).json(error('Пользователь с таким email уже существует'));
        return;
      }
      if (existingUser.iin === iin) {
        res.status(400).json(error('Пользователь с таким ИИН уже существует'));
        return;
      }
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      fatherName,
      age: parseInt(age, 10),
      iin,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json(success({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        age: user.age,
        iin: user.iin,
        role: user.role,
      },
      token,
    }));
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      res.status(400).json(error(err.message));
      return;
    }
    next(err);
  }
};

/**
 * Login user
 * POST /auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json(error('Email и пароль обязательны'));
      return;
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json(error('Неверный email или пароль'));
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json(error('Неверный email или пароль'));
      return;
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json(success({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        age: user.age,
        iin: user.iin,
        role: user.role,
      },
      token,
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Get current user profile
 * GET /auth/me
 */
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    res.json(success({
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        fatherName: req.user.fatherName,
        age: req.user.age,
        iin: req.user.iin,
        createdAt: req.user.createdAt,
      },
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Update user profile
 * PATCH /auth/me
 */
export const updateMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const allowedFields = ['firstName', 'lastName', 'fatherName', 'age'];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404).json(error('Пользователь не найден'));
      return;
    }

    res.json(success({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fatherName: user.fatherName,
        age: user.age,
        iin: user.iin,
      },
    }));
  } catch (err) {
    next(err);
  }
};

/**
 * Change password
 * POST /auth/change-password
 */
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json(error('Не авторизован'));
      return;
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400).json(error('Текущий и новый пароли обязательны'));
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json(error('Новый пароль должен быть минимум 6 символов'));
      return;
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      res.status(404).json(error('Пользователь не найден'));
      return;
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401).json(error('Неверный текущий пароль'));
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json(success({ message: 'Пароль успешно изменен' }));
  } catch (err) {
    next(err);
  }
};

