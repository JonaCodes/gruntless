import Workflow from 'models/workflow';
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

  await Workflow.create({
    accountId,
    userId,
    name,
    description,
    actionButtonLabel,
    estSavedMinutes: estSavedMinutes || null,
    parentWorkflowId: null, // Root workflow
    rootWorkflowId: null, // Self-reference for root
    version: 1,
    status: WORKFLOW_VERSION_STATUS.APPROVED,
    fileExtracts: [],
    fields,
    execution,
    rejectionReason: null,
  });
};
