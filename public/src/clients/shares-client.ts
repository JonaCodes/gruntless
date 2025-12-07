import { HTTP_METHODS, ENDPOINTS } from './client-consts';
import { makeRequest } from './http-client';

export const createWorkflowShare = async (
  workflowId: number
): Promise<{ url: string; shareId: string }> => {
  const response = await makeRequest(
    HTTP_METHODS.POST,
    ENDPOINTS.SHARES.CREATE,
    { workflowId }
  );

  if (response.error) {
    throw new Error(response.message || 'Failed to create share');
  }

  return response.data;
};

export const acceptShare = async (
  shareId: string
): Promise<{ success: boolean; workflowId?: number }> => {
  const response = await makeRequest(
    HTTP_METHODS.POST,
    ENDPOINTS.SHARES.ACCEPT,
    { shareId }
  );

  if (response.error) {
    throw new Error(response.message || 'Failed to accept share');
  }

  return response.data;
};
