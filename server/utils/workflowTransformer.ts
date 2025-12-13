import {
  Workflow,
  WorkflowExecution,
  WorkflowField,
} from '@shared/types/workflows';

interface WorkflowData {
  id: number;
  name: string | null;
  description: string | null;
  actionButtonLabel: string | null;
  estSavedMinutes: number | null;
  fields: WorkflowField[] | null;
  execution: WorkflowExecution | null;
}

// Transforms a database Workflow model into the frontend format
export function transformToFrontendFormat(
  workflow: WorkflowData,
  numRuns: number,
  lastRun: string | null
): Workflow {
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
    fields: workflow.fields || [],
    actionButton: {
      label: workflow.actionButtonLabel || 'Run Workflow',
      onClick: () => {}, // Placeholder - frontend will handle this
    },
    execution: workflow.execution
      ? {
          dependencies: workflow.execution.dependencies || [],
          outputFilename: workflow.execution.outputFilename,
          isTextOutput: workflow.execution.isTextOutput,
          script: workflow.execution.script,
        }
      : undefined,
  };
}
