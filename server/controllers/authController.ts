import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user) {
      res.json(req.user);
      return;
    }

    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await AuthService.syncAndGetUser(token);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
