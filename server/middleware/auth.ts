import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import User from 'models/user';
import { APP_ADMIN_ID } from '@shared/consts/general';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'development') {
    const user = await User.findOne({ where: { id: 1 } });
    req.user = user || undefined;
    return next();
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: 'No token provided - middleware rejection' });
    }

    const user = await AuthService.getCurrentUser(token);
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error: any) {
    console.error('Auth middleware error:', error.message, error);
    res.status(401).json({ error: error.message });
  }
};

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.user?.id !== APP_ADMIN_ID ||
    req.user?.email !== process.env.BETA_EMAILS?.split(',')[0]
  ) {
    return res.status(403).json({ error: 'Nope.' });
  }

  next();
};
