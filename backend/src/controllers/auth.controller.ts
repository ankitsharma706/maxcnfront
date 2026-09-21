import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

/**
 * POST /api/auth/register
 * Register a new user.
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Create user
    const user = await User.create({ name, email, password });

    // Generate tokens
    const payload = { id: (user._id as any).toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken });

    logger.info(`User registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password.
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password field included
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const payload = { id: (user._id as any).toString(), email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    // Store refresh token (rotation)
    await User.findByIdAndUpdate(user._id, { refreshToken });

    logger.info(`User logged in: ${email}`);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token.
 * Implements refresh token rotation.
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      throw new AppError('Refresh token is required', 400);
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token);

    // Find user and check stored refresh token
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.refreshToken !== token) {
      // Token reuse detected — potential security breach
      // Invalidate all tokens for this user
      await User.findByIdAndUpdate(user._id, { refreshToken: null });
      logger.warn(`Refresh token reuse detected for user: ${user.email}`);
      throw new AppError('Invalid refresh token. Please login again.', 401);
    }

    // Generate new token pair (rotation)
    const payload = { id: (user._id as any).toString(), email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Store new refresh token
    await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
