import { fn, col, Op } from 'sequelize';
import WorkflowRun from '../../models/workflow_run';
import Workflow from '../../models/workflow';
import { hasWorkflowAccess } from './workflowsService';

interface WorkflowStatsQueryResult {
  numRuns: string; // Sequelize returns COUNT as string
  lastRun: string | null;
}

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

export const getWorkflowStats = async (userId: number, workflowId: number) => {
  const workflow = await Workflow.findByPk(workflowId);
  if (!workflow) return { numRuns: 0, lastRun: null };

  const rootId = workflow.rootWorkflowId || workflow.id;

  const workflows = await Workflow.findAll({
    where: {
      [Op.or]: [{ id: rootId }, { rootWorkflowId: rootId }],
    },
    attributes: ['id'],
    raw: true,
  });

  const workflowIds = workflows.map((w: any) => w.id);

  const stats = (await WorkflowRun.findAll({
    where: {
      userId,
      workflowId: { [Op.in]: workflowIds },
      success: true,
    },
    attributes: [
      [fn('COUNT', col('id')), 'numRuns'],
      [fn('MAX', col('created_at')), 'lastRun'],
    ],
    raw: true,
  })) as unknown as WorkflowStatsQueryResult[];

  return {
    numRuns: parseInt(stats[0]?.numRuns || '0'),
    lastRun: stats[0]?.lastRun || null,
  };
};
