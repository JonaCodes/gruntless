import { nanoid } from 'nanoid';
import { Transaction } from 'sequelize';
import WorkflowShare from '../../models/workflow_share';
import Workflow from '../../models/workflow';
import User from '../../models/user';
import { WORKFLOW_VERSION_STATUS } from '@shared/consts/workflows';
import sequelize from '../../config/database';

const createWorkflowFork = async (
  originalWorkflow: Workflow,
  acceptingUser: User,
  targetRootWorkflowId: number,
  transaction: Transaction
): Promise<Workflow> => {
  return await Workflow.create(
    {
      accountId: acceptingUser.accountId,
      userId: acceptingUser.id,
      name: originalWorkflow.name,
      description: originalWorkflow.description,
      label: originalWorkflow.label,
      actionButtonLabel: originalWorkflow.actionButtonLabel,
      estSavedMinutes: originalWorkflow.estSavedMinutes,
      parentWorkflowId: originalWorkflow.id,
      rootWorkflowId: targetRootWorkflowId,
      version: 1,
      status: WORKFLOW_VERSION_STATUS.APPROVED,
      fileExtracts: originalWorkflow.fileExtracts,
      fields: originalWorkflow.fields,
      execution: originalWorkflow.execution,
      rejectionReason: null,
    },
    { transaction }
  );
};

const markShareAccepted = async (
  shareId: string,
  userId: number,
  transaction: Transaction
) => {
  return await WorkflowShare.update(
    { sharedWith: userId, acceptedAt: new Date() },
    { where: { id: shareId }, transaction }
  );
};

const handleForkConstraintError = async (
  error: any,
  userId: number,
  targetRootWorkflowId: number,
  shareId: string,
  transaction: Transaction
): Promise<{
  success: boolean;
  workflowId?: number;
  error?: string;
  message?: string;
} | null> => {
  if (error.name !== 'SequelizeUniqueConstraintError') {
    return null; // Not a constraint error, caller should re-throw
  }

  const existingFork = await Workflow.findOne({
    where: { userId, rootWorkflowId: targetRootWorkflowId },
    transaction,
  });

  if (existingFork) {
    await markShareAccepted(shareId, userId, transaction);

    return {
      success: true,
      workflowId: existingFork.id,
      message: 'You already have this workflow',
    };
  }

  return null; // Constraint error but no fork found - re-throw
};

export const createShare = async (workflowId: number): Promise<string> => {
  const workflow = await Workflow.findByPk(workflowId);
  if (!workflow) {
    throw new Error('Workflow not found');
  }

  const shareId = nanoid(8);
  const share = await WorkflowShare.create({
    id: shareId,
    workflowId,
    sharedBy: workflow.userId,
  });

  return share.id;
};

// Employs optimistic concurrency control to prevent race conditions
export const acceptShare = async (
  shareId: string,
  userId: number
): Promise<{
  success: boolean;
  workflowId?: number;
  error?: string;
  message?: string;
}> => {
  const share = await WorkflowShare.findByPk(shareId);
  if (!share) return { success: false, error: 'Invalid share link' };

  const originalWorkflow = await Workflow.findByPk(share.workflowId);
  if (!originalWorkflow) return { success: false, error: 'Workflow not found' };

  const acceptingUser = await User.findByPk(userId);
  if (!acceptingUser) return { success: false, error: 'User not found' };

  const targetRootWorkflowId =
    originalWorkflow.rootWorkflowId || originalWorkflow.id;

  const result = await sequelize.transaction(async (t) => {
    const lockedShare = await WorkflowShare.findByPk(shareId, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!lockedShare) {
      return { success: false, error: 'Invalid share link' };
    }

    let existingFork = await Workflow.findOne({
      where: {
        userId,
        rootWorkflowId: targetRootWorkflowId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE, // Lock if found
    });

    if (existingFork) {
      return {
        success: true,
        workflowId: existingFork.id,
        message: 'You already have this workflow',
      };
    }

    try {
      const forkedWorkflow = await createWorkflowFork(
        originalWorkflow,
        acceptingUser,
        targetRootWorkflowId,
        t
      );

      await markShareAccepted(shareId, userId, t);

      return { success: true, workflowId: forkedWorkflow.id };
    } catch (error: any) {
      const handled = await handleForkConstraintError(
        error,
        userId,
        targetRootWorkflowId,
        shareId,
        t
      );

      if (handled) return handled;
      throw error;
    }
  });

  return result;
};
