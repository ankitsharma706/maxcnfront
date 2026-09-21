import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { logger } from '../utils/logger';

interface JwtPayloadCustom {
  id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadCustom;
    }
  }
}

/**
 * Middleware: Verify JWT access token from Authorization header.
 * Attaches decoded user info to req.user.
 */
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, jwtConfig.accessToken.secret) as JwtPayloadCustom;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired. Please refresh your token.',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }

    logger.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.',
    });
  }
};

/**
 * Factory: Create role-based authorization middleware.
 * Must be used after authenticate middleware.
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
      return;
    }

    next();
  };
};

/**
 * Generate JWT access token.
 */
export const generateAccessToken = (payload: JwtPayloadCustom): string => {
  return jwt.sign(payload, jwtConfig.accessToken.secret, {
    expiresIn: jwtConfig.accessToken.expiresIn,
  });
};

/**
 * Generate JWT refresh token.
 */
export const generateRefreshToken = (payload: JwtPayloadCustom): string => {
  return jwt.sign(payload, jwtConfig.refreshToken.secret, {
    expiresIn: jwtConfig.refreshToken.expiresIn,
  });
};

/**
 * Verify refresh token.
 */
export const verifyRefreshToken = (token: string): JwtPayloadCustom => {
  return jwt.verify(token, jwtConfig.refreshToken.secret) as JwtPayloadCustom;
};
