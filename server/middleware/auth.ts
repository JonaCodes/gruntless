import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

const ADMIN_EMAIL = 'jonathanfarache@gmail.com';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
  if (req.user?.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  next();
};
