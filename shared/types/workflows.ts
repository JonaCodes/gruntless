// TODO: remove and let user create their own
export type WorkflowCategory =
  | 'Sales'
  | 'Finance'
  | 'Internal'
  | 'Legal'
  | 'Marketing';

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
  min_files?: number;
  max_files?: number;
}

export interface WorkflowMetadata {
  id: string;
  category: WorkflowCategory;
  name: string;
  description: string;
  lastRun: string | null; // ISO date string from API
  numRuns: number;
  numSaved?: number; // Optional for display like "142 runs (28h saved)"
}

export interface WorkflowAction {
  label: string;
  onClick: () => void;
}

export interface WorkflowExecution {
  dependencies: string[];
  outputFilename: string;
  script: string;
}

export interface Workflow {
  metadata: WorkflowMetadata;
  fields: WorkflowField[];
  actionButton: WorkflowAction;
  execution?: WorkflowExecution;
}

export type FileType = 'csv' | 'xlsx' | 'pdf';

export const EXTRACTION_STATUS = {
  EXTRACTING: 'extracting',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type ExtractionStatus =
  (typeof EXTRACTION_STATUS)[keyof typeof EXTRACTION_STATUS];

export interface FileExtract {
  fileName: string;
  fileType: FileType;
  // CSV/XLSX fields
  columns?: string[];
  sample_rows?: string[][];
  row_count?: number;
  // PDF fields
  markdown_content?: string;
  page_count?: number;
}

export interface SeedWorkflowInput {
  name: string;
  description: string;
  actionButtonLabel: string;
  estSavedMinutes?: number;
  fields: WorkflowField[];
  execution: WorkflowExecution;
}
