import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export const signUpWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.signUpWithEmail(email, password);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signInWithEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await AuthService.signInWithEmail(email, password);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signInWithProvider = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { provider, token } = req.body;
    const user = await AuthService.signInWithProvider(
      provider as 'google' | 'apple',
      token
    );
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signOut = async (_: Request, res: Response): Promise<void> => {
  try {
    await AuthService.signOut();
    res.json({ message: 'Signed out successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

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

    const user = await AuthService.getCurrentUser(token);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
