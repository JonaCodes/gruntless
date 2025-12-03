import PyodideWorkerManager from 'public/src/workers/pyodide/PyodideWorkerManager';
import { WORKER_MESSAGES } from 'public/src/consts/pyodide';
import type { ExtractionResult, FileHandler } from '../types';

export class CSVHandler implements FileHandler {
  async extractPreview(
    file: File,
    sampleRows: number = 3
  ): Promise<ExtractionResult> {
    const manager = PyodideWorkerManager.getInstance();

    await manager.ensureInitialized();
    const worker = manager.getWorker();
    const content = await file.arrayBuffer();

    const requestId = crypto.randomUUID(); // To avoid race conditions when uploading multiple files at once

    return new Promise((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        const { type, payload } = event.data;

        if (
          type === WORKER_MESSAGES.SUCCESS &&
          payload.requestId === requestId
        ) {
          worker.removeEventListener('message', handleMessage);

          resolve({
            columns: payload.extraction.columns,
            rows: payload.extraction.rows,
            rowCount: payload.extraction.rowCount,
          });
        } else if (
          type === WORKER_MESSAGES.ERROR &&
          payload.requestId === requestId
        ) {
          worker.removeEventListener('message', handleMessage);
          reject(new Error(payload.message));
        }
      };

      worker.addEventListener('message', handleMessage);

      worker.postMessage({
        type: WORKER_MESSAGES.EXTRACT,
        payload: {
          file: { name: file.name, content },
          sampleRows,
          requestId,
        },
      });
    });
  }
}
