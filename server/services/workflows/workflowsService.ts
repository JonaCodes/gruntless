import Workflow from '../../models/workflow';
import WorkflowVersion from '../../models/workflow_version';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import { transformToFrontendFormat } from '../../utils/workflowTransformer';

export const getWorkflowsByUser = async (userId: number) => {
  const workflows = await Workflow.findAll({
    where: { userId },
    include: [
      {
        model: WorkflowVersion,
        as: 'versions',
        where: {
          isActive: true,
          status: WORKFLOW_VERSION_STATUS.APPROVED,
        },
        required: false,
      },
    ],
    order: [['updatedAt', 'DESC']],
  });

  // Transform to frontend format, only include workflows with active versions
  const transformedWorkflows = workflows
    .filter((w) => w.versions && w.versions.length > 0)
    .map((workflow) => transformToFrontendFormat(workflow));

  return transformedWorkflows;
};
