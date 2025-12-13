import { Request, Response } from 'express';
import * as shareService from '../services/workflows/shareService';
import { WF_SHARE_URL_PARAM } from '@shared/consts/general';
import Workflow from '../models/workflow';

export const createShare = async (req: Request, res: Response) => {
  try {
    const { workflowId } = req.body;

    if (!workflowId) {
      return res.status(400).json({ error: 'workflowId required' });
    }

    const workflow = await Workflow.findByPk(workflowId);
    if (!workflow) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    // This is to prevent a malicious, tech-savvy user from creating a share for a workflow they don't own by guessing a workflow ID
    if (workflow.userId !== req.user!.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const shareId = await shareService.createShare(workflowId);
    const url = `${req.protocol}://${req.get(
      'host'
    )}/grunts/?${WF_SHARE_URL_PARAM}=${shareId}`;

    res.json({ url, shareId });
  } catch (error) {
    console.error('createShare error:', error);
    res.status(500).json({ error: 'Failed to create share' });
  }
};

export const acceptShare = async (req: Request, res: Response) => {
  try {
    const { shareId } = req.body;

    if (!shareId) {
      return res.status(400).json({ error: 'shareId required' });
    }

    const result = await shareService.acceptShare(shareId, req.user!.id);

    if (!result.success) {
      console.warn('Unable to accept share:', shareId, result.error);
      return res.status(400).json({ error: result.error });
    }

    res.json(result);
  } catch (error) {
    console.error('acceptShare error:', error);
    res.status(500).json({ error: 'Failed to accept share' });
  }
};
