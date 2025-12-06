import Workflow from 'models/workflow';
import WorkflowVersion from 'models/workflow_version';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import { WorkflowField, WorkflowExecution } from '@shared/types/workflows';

export const seedManualWorkflow = async (
  accountId: number,
  userId: number,
  name: string,
  workflowParams: {
    name: string;
    description: string;
    actionButtonLabel: string;
    estSavedMinutes: number;
    fields: WorkflowField[];
    execution: WorkflowExecution;
  }
) => {
  const { description, actionButtonLabel, estSavedMinutes, fields, execution } =
    workflowParams;

  const workflow = await Workflow.create({
    accountId,
    userId,
    name,
    description,
    actionButtonLabel,
    estSavedMinutes: estSavedMinutes || null,
    numRuns: 0,
    lastRun: null,
  });

  await WorkflowVersion.create({
    workflowId: workflow.id,
    accountId,
    version: 1,
    status: WORKFLOW_VERSION_STATUS.APPROVED,
    isActive: true,
    fileExtracts: [],
    fields,
    execution,
  });
};
