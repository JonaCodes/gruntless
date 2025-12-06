import { Request, Response } from 'express';
import { getWorkflowsByUser } from '../services/workflows/workflowsService';
import { seedManualWorkflow } from 'services/workflows/seeder';

export const listWorkflows = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const transformedWorkflows = await getWorkflowsByUser(userId);
    res.json(transformedWorkflows);
  } catch (error) {
    console.error('listWorkflows error:', error);
    res.status(500).json({ error: 'Failed to list workflows' });
  }
};

export const createWorkflow = async (_req: Request, res: Response) => {
  try {
    // TODO
  } catch (error) {
    console.error('createWorkflow error:', error);
    res.status(500).json({ error: 'Failed to create workflow' });
  }
};

export const getWorkflow = async (_req: Request, res: Response) => {
  try {
    // TODO
  } catch (error) {
    console.error('getWorkflow error:', error);
    res.status(500).json({ error: 'Failed to get workflow' });
  }
};

export const sendMessage = async (_req: Request, res: Response) => {
  try {
    // TODO
  } catch (error) {
    console.error('sendMessage error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const approveWorkflow = async (_req: Request, res: Response) => {
  try {
    // TODO
  } catch (error) {
    console.error('approveWorkflow error:', error);
    res.status(500).json({ error: 'Failed to approve workflow' });
  }
};

export const editWorkflow = async (_req: Request, res: Response) => {
  try {
    // TODO
  } catch (error) {
    console.error('editWorkflow error:', error);
    res.status(500).json({ error: 'Failed to start edit' });
  }
};

export const seedWorkflow = async (req: Request, res: Response) => {
  try {
    const { name, description, actionButtonLabel, fields, execution } =
      req.body;

    if (!name || !description || !actionButtonLabel || !fields || !execution) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const accountId = req.user!.accountId;
    const userId = req.user!.id;

    await seedManualWorkflow(accountId, userId, name, req.body);
    res.status(200).json({
      success: true,
      message: 'Workflow seeded successfully',
    });
  } catch (error) {
    console.error('seedWorkflow error:', error);
    res.status(500).json({ error: 'Failed to seed workflow' });
  }
};
