import { fn, col, literal } from 'sequelize';
import WorkflowRun from '../../models/workflow_run';
import { hasWorkflowAccess } from './workflowsService';

export const recordWorkflowRun = async (
  workflowId: number,
  userId: number,
  accountId: number,
  success: boolean
): Promise<void> => {
  const hasAccess = await hasWorkflowAccess(workflowId, userId);
  if (!hasAccess) throw new Error('Workflow not found or access denied');

  await WorkflowRun.create({
    workflowId,
    userId,
    accountId,
    success,
  });
};

export const getUserWorkflowRunStats = async (userId: number) => {
  const runStats = await WorkflowRun.findAll({
    where: { userId },
    attributes: [
      'workflowId',
      [fn('COUNT', literal('CASE WHEN success = true THEN 1 END')), 'numRuns'],
      [fn('MAX', col('created_at')), 'lastRun'],
    ],
    group: ['workflowId'],
    raw: true,
  });

  // Create a map of workflow_id -> stats
  return new Map(
    runStats.map((stat: any) => [
      stat.workflowId,
      { numRuns: parseInt(stat.numRuns) || 0, lastRun: stat.lastRun },
    ])
  );
};
