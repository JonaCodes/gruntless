import { makeAutoObservable } from 'mobx';
import { createWorkflowShare } from '../clients/shares-client';
import { WorkflowMetadata } from '@shared/types/workflows';

interface ShareNotification {
  type: 'success' | 'error';
  workflowId: number;
}

class WorkflowSharingStore {
  isCreatingShare = false;
  notification: ShareNotification | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setIsCreatingShare(isCreating: boolean) {
    this.isCreatingShare = isCreating;
  }

  showNotification(type: 'success' | 'error', workflowId: number) {
    this.notification = { type, workflowId };
  }

  clearNotification() {
    this.notification = null;
  }

  async handleShare(metadata: WorkflowMetadata) {
    this.setIsCreatingShare(true);
    try {
      const { url } = await createWorkflowShare(Number(metadata.id));
      await navigator.clipboard.writeText(url);
      this.showNotification('success', Number(metadata.id));
      setTimeout(() => this.clearNotification(), 8_000);
    } catch (error) {
      console.error('Failed to create share:', error);
      this.showNotification('error', Number(metadata.id));
      setTimeout(() => this.clearNotification(), 8_000);
    } finally {
      this.setIsCreatingShare(false);
    }
  }
}

const workflowSharingStore = new WorkflowSharingStore();
export default workflowSharingStore;
