import { Request, Response } from 'express';
import {
  getTopUsersWithStats,
  getUserWorkflowsWithRunStats,
  deleteUserCompletely,
} from '../services/backoffice/userManagementService';

export const getTopUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await getTopUsersWithStats();
    res.json(users);
  } catch (error: any) {
    console.error('getTopUsers error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserWorkflows = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    const workflows = await getUserWorkflowsWithRunStats(userId);
    res.json(workflows);
  } catch (error: any) {
    console.error('getUserWorkflows error:', error);
    res.status(500).json({ error: 'Failed to fetch user workflows' });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    await deleteUserCompletely(userId);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('deleteUser error:', error);
    const message = error.message || 'Failed to delete user';
    res.status(500).json({ error: message });
  }
};
