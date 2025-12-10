import Workflow from '../../models/workflow';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import { transformToFrontendFormat } from '../../utils/workflowTransformer';
import { getWorkflowStats } from './workflowRunService';

interface GetUserWorkflowsOptions {
  idsOnly?: boolean;
}

export const getUserWorkflows = async (
  userId: number,
  options: GetUserWorkflowsOptions = {}
): Promise<Workflow[] | number[]> => {
  const { idsOnly = false } = options;

  if (idsOnly) {
    const workflows = await Workflow.findAll({
      attributes: ['id'],
      raw: true,
    });

    return workflows.map((w: any) => w.id);
  }

  return await Workflow.findAll({ where: { userId } });
};

export const hasWorkflowAccess = async (
  workflowId: number,
  userId: number
): Promise<boolean> => {
  const workflowIds = (await getUserWorkflows(userId, {
    idsOnly: true,
  })) as number[];

  return workflowIds.includes(workflowId);
};

export const getUserWorkflowsWithStats = async (userId: number) => {
  const workflows = (await getUserWorkflows(userId)) as Workflow[];

  const approvedWorkflows = workflows.filter(
    (w: any) => w.status === WORKFLOW_VERSION_STATUS.APPROVED
  );

  // Get stats for each workflow
  const workflowsWithStats = await Promise.all(
    approvedWorkflows.map(async (workflow: any) => {
      const stats = await getWorkflowStats(userId, workflow.id);
      return transformToFrontendFormat(workflow, stats.numRuns, stats.lastRun);
    })
  );

  return workflowsWithStats;
};
