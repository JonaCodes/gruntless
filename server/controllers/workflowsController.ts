import { Request, Response } from 'express';

export const getWorkflows = async (_: Request, res: Response) => {
  try {
    const workflows: any[] = [];
    res.json(workflows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: JSON.stringify(error) });
  }
};
