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

/**
 * Transforms a database Workflow model (with versions) into the frontend format
 */
export function transformToFrontendFormat(
  workflow: WorkflowWithVersions
): Workflow {
  const activeVersion = workflow.versions?.[0];

  // Calculate numSaved: numRuns * estSavedMinutes / 60 (convert to hours)
  const numSaved = workflow.estSavedMinutes
    ? (workflow.numRuns * workflow.estSavedMinutes) / 60
    : undefined;

  return {
    metadata: {
      id: workflow.id.toString(),
      name: workflow.name || '',
      description: workflow.description || '',
      category: 'Internal', // TODO: Will come from FK to workflow_categories later
      lastRun: workflow.lastRun,
      numRuns: workflow.numRuns,
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
