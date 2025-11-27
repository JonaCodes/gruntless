export type WorkflowCategory = 'Sales' | 'Finance' | 'Internal';

export type WorkflowFieldType =
  | 'multi_file_upload'
  | 'file_upload'
  | 'text_input';

export interface WorkflowField {
  id: string;
  type: WorkflowFieldType;
  label: string;
  placeholder?: string;
  accept?: string[]; // MIME types for file uploads
}

export interface WorkflowMetadata {
  id: string;
  category: WorkflowCategory;
  name: string;
  description: string;
  lastRun: Date | null;
  numRuns: number;
  numSaved?: number; // Optional for display like "142 runs (28h saved)"
}

export interface WorkflowAction {
  label: string;
  onClick: () => void;
}

export interface Workflow {
  metadata: WorkflowMetadata;
  fields: WorkflowField[];
  actionButton: WorkflowAction;
}
