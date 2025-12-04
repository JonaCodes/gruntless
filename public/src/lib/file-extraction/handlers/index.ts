import { CSVHandler } from './csv';
import { PDFHandler } from './pdf';
import type { FileType, FileHandler } from '../types';

const handlers: Record<FileType, FileHandler> = {
  csv: new CSVHandler(),
  xlsx: null as any, // TODO: Implement
  pdf: new PDFHandler(),
};

export function getFileType(filename: string): FileType | null {
  const ext = filename.split('.').pop()?.toLowerCase();

  switch (ext) {
    case 'csv':
      return 'csv';
    case 'xlsx':
    case 'xls':
      return 'xlsx';
    case 'pdf':
      return 'pdf';
    default:
      return null;
  }
}

export async function extractFilePreview(file: File, sampleRows: number = 3) {
  const fileType = getFileType(file.name);

  if (!fileType) {
    throw new Error(`Unsupported file type: ${file.name}`);
  }

  const handler = handlers[fileType];

  if (!handler) {
    throw new Error(
      `We currently do not support ${fileType.toUpperCase()} files. But we are working on it.`
    );
  }

  return handler.extractPreview(file, sampleRows);
}
