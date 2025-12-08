import {
  Workflow,
  WorkflowExecution,
  WorkflowField,
} from '@shared/types/workflows';

interface WorkflowWithVersions {
  id: number;
  name: string | null;
  description: string | null;
  lastRun: Date | null;
  numRuns: number;
  actionButtonLabel: string | null;
  estSavedMinutes: number | null;
  versions?: Array<{
    fields: WorkflowField[] | null;
    execution: WorkflowExecution | null;
  }>;
}

// Transforms a database Workflow model (with versions) into the frontend format
export function transformToFrontendFormat(
  workflow: WorkflowWithVersions,
  numRuns: number,
  lastRun: string | null
): Workflow {
  const activeVersion = workflow.versions?.[0];

  // Calculate numSaved: numRuns * estSavedMinutes / 60 (convert to hours)
  const numSaved = workflow.estSavedMinutes
    ? (numRuns * workflow.estSavedMinutes) / 60
    : undefined;

  return {
    metadata: {
      id: workflow.id.toString(),
      name: workflow.name || '',
      description: workflow.description || '',
      category: 'Internal', // TODO: Will come from FK to workflow_categories later
      lastRun, // ISO string or null - frontend converts to Date at point of use
      numRuns,
      numSaved,
    },
    fields: activeVersion?.fields || [],
    actionButton: {
      label: workflow.actionButtonLabel || 'Run Workflow',
      onClick: () => {}, // Placeholder - frontend will handle this
    },
    execution: activeVersion?.execution
      ? {
          dependencies: activeVersion.execution.dependencies || [],
          outputFilename: activeVersion.execution.outputFilename,
          script: activeVersion.execution.script,
        }
      : undefined,
  };
}
