import { Workflow, SeedWorkflowInput } from '@shared/types/workflows';
import { ENDPOINTS, HTTP_METHODS } from './client-consts';
import { makeRequest } from './http-client';

export const fetchWorkflows = async (): Promise<Workflow[]> => {
  const response = await makeRequest(
    HTTP_METHODS.GET,
    ENDPOINTS.WORKFLOWS.LIST
  );
  if (response.error || !Array.isArray(response.data)) {
    return [];
  }
  return response.data;
};

export const seedWorkflow = async (
  workflowData: SeedWorkflowInput
): Promise<void> => {
  const response = await makeRequest(
    HTTP_METHODS.POST,
    ENDPOINTS.WORKFLOWS.ADMIN_SEED,
    workflowData
  );

  if (response.error) {
    throw new Error(response.message || 'Failed to seed workflow');
  }
};
