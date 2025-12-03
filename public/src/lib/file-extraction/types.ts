export type FileType = 'csv' | 'xlsx' | 'pdf';

export interface ExtractionResult {
  columns: string[];
  rows: string[][];
  rowCount: number;
}

export interface FileHandler {
  extractPreview(file: File, sampleRows?: number): Promise<ExtractionResult>;
}
