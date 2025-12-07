import { nanoid } from 'nanoid';
import WorkflowShare from '../../models/workflow_share';
import Workflow from '../../models/workflow';

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

export const acceptShare = async (
  shareId: string,
  userId: number
): Promise<{ success: boolean; workflowId?: number; error?: string }> => {
  const share = await WorkflowShare.findByPk(shareId);

  if (!share) return { success: false, error: 'Invalid share link' };

  const workflow = await Workflow.findByPk(share.workflowId);
  if (!workflow) return { success: false, error: 'Workflow not found' };

  const existingAccess = await WorkflowShare.findOne({
    where: { workflowId: share.workflowId, sharedWith: userId },
  });

  if (existingAccess) {
    return {
      success: true,
      error: 'You already have access to this workflow',
    };
  }

  await WorkflowShare.update(
    { sharedWith: userId, acceptedAt: new Date() },
    { where: { id: shareId } }
  );

  return { success: true, workflowId: share.workflowId };
};
