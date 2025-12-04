import { PyodideInterface } from 'pyodide';
import { extractCsv } from './csvExtractor';
import { extractPdf } from './pdfExtractor';

export const extractFilePreview = async (
  file: { name: string; content: ArrayBuffer },
  sampleRows: number,
  pyodide: PyodideInterface,
  ensureDir: (dir: string) => void
): Promise<{
  columns?: string[];
  rows?: string[][];
  rowCount?: number;
  markdownContent?: string;
  pageCount?: number;
}> => {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  // Mount file to virtual filesystem
  const filePath = `/extract/${file.name}`;
  ensureDir('/extract');
  pyodide.FS.writeFile(filePath, new Uint8Array(file.content));

  try {
    let result;

    switch (fileExtension) {
      case 'csv':
        result = await extractCsv(filePath, sampleRows, pyodide);
        break;
      case 'pdf':
        result = await extractPdf(filePath, pyodide);
        break;
      // Future: xlsx handler
      default:
        throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    // Clean up
    pyodide.FS.unlink(filePath);

    return result;
  } catch (error) {
    // Clean up on error
    try {
      pyodide.FS.unlink(filePath);
    } catch {}
    throw error;
  }
};
