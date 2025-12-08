import { literal } from 'sequelize';
import Workflow from '../../models/workflow';
import WorkflowVersion from '../../models/workflow_version';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import { transformToFrontendFormat } from '../../utils/workflowTransformer';
import { getUserWorkflowRunStats } from './workflowRunService';

interface GetUserWorkflowsOptions {
  idsOnly?: boolean;
  includeVersions?: boolean;
}

export const getUserWorkflows = async (
  userId: number,
  options: GetUserWorkflowsOptions = {}
): Promise<Workflow[] | number[]> => {
  const { idsOnly = false, includeVersions = false } = options;

  const baseQuery = {
    where: literal(`
      "Workflow"."user_id" = ${userId}
      OR EXISTS (
        SELECT 1
        FROM workflow_shares ws
        WHERE ws.workflow_id = "Workflow"."id"
          AND ws.shared_with = ${userId}
          AND ws.accepted_at IS NOT NULL
      )
    `),
  };

  if (idsOnly) {
    const workflows = await Workflow.findAll({
      ...baseQuery,
      attributes: ['id'],
      raw: true,
    });

    return workflows.map((w: any) => w.id);
  }

  const query: any = { ...baseQuery };

  if (includeVersions) {
    query.include = [
      {
        model: WorkflowVersion,
        as: 'versions',
        where: {
          isActive: true,
          status: WORKFLOW_VERSION_STATUS.APPROVED,
        },
        required: false,
      },
    ];
    query.order = [['updatedAt', 'DESC']];
  }

  return await Workflow.findAll(query);
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
  const [workflows, runStatsMap] = await Promise.all([
    getUserWorkflows(userId, { includeVersions: true }),
    getUserWorkflowRunStats(userId),
  ]);

  return (workflows as Workflow[])
    .filter((w: any) => w.versions && w.versions.length > 0)
    .map((workflow: any) => {
      const stats = runStatsMap.get(workflow.id) || {
        numRuns: 0,
        lastRun: null,
      };
      return transformToFrontendFormat(workflow, stats.numRuns, stats.lastRun);
    });
};
