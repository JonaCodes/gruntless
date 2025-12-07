import { LocalStorageService } from './local-storage-service';
import { acceptShare } from '../clients/shares-client';
import { LS_KEYS } from '../consts/localStorage';

export const handlePendingShare = async (): Promise<{
  success: boolean;
  workflowId?: number;
}> => {
  const pendingShare = LocalStorageService.get<string>(LS_KEYS.PENDING_SHARE);
  if (!pendingShare) return { success: false };

  try {
    const result = await acceptShare(pendingShare);
    return result;
  } catch (err) {
    console.error('Failed to accept share:', err);
    return { success: false };
  } finally {
    LocalStorageService.remove(LS_KEYS.PENDING_SHARE);
  }
};
