import { HTTP_METHODS } from './client-consts';
import { makeRequest } from './http-client';

export interface UserWithStats {
  id: number;
  email: string;
  fullName: string | null;
  workflowCount: number;
  totalRuns: number;
  lastActivity: string | null;
}

export interface UserWorkflow {
  id: number;
  name: string;
  runs: number;
  lastRun: string | null;
}

export const fetchTopUsers = async (): Promise<UserWithStats[]> => {
  const response = await makeRequest(
    HTTP_METHODS.GET,
    '/api/backoffice/users'
  );

  if (response.error || !Array.isArray(response.data)) {
    throw new Error(response.message || 'Failed to fetch users');
  }

  return response.data;
};

export const fetchUserWorkflows = async (
  userId: number
): Promise<UserWorkflow[]> => {
  const response = await makeRequest(
    HTTP_METHODS.GET,
    `/api/backoffice/users/${userId}/workflows`
  );

  if (response.error || !Array.isArray(response.data)) {
    throw new Error(response.message || 'Failed to fetch user workflows');
  }

  return response.data;
};

export const deleteUser = async (userId: number): Promise<void> => {
  const response = await makeRequest(
    HTTP_METHODS.DELETE,
    `/api/backoffice/users/${userId}`
  );

  if (response.error) {
    throw new Error(response.message || 'Failed to delete user');
  }
};
