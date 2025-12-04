export type FileType = 'csv' | 'xlsx' | 'pdf';

export interface ExtractionResult {
  // CSV/XLSX structure
  columns?: string[];
  rows?: string[][];
  rowCount?: number;
  // PDF structure
  markdownContent?: string;
  pageCount?: number;
}

export interface FileHandler {
  extractPreview(file: File, sampleRows?: number): Promise<ExtractionResult>;
}
