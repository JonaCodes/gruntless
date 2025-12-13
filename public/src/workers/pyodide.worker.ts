/* eslint-disable no-restricted-globals */
import { PyodideController } from './pyodide/PyodideController';
import { extractFilePreview } from './pyodide/extractors/fileExtractor';
import { ERROR_MESSAGES } from '../consts/pyodide';
import { WORKER_MESSAGES } from '../consts/pyodide';

// Define types for the worker messages
type WorkerMessage =
  | { type: typeof WORKER_MESSAGES.INIT; payload: { dependencies: string[] } }
  | {
      type: typeof WORKER_MESSAGES.RUN;
      payload: {
        script: string;
        files: { fieldId: string; name: string; content: ArrayBuffer }[];
        textInputs: Record<string, string>;
        outputFilename: string | null;
        isTextOutput: boolean;
      };
    }
  | {
      type: typeof WORKER_MESSAGES.EXTRACT;
      payload: {
        file: { name: string; content: ArrayBuffer };
        sampleRows: number;
        requestId: string;
      };
    };

type WorkerResponse =
  | { type: typeof WORKER_MESSAGES.READY }
  | {
      type: typeof WORKER_MESSAGES.LOG;
      payload: { type: 'stdout' | 'stderr'; message: string };
    }
  | {
      type: typeof WORKER_MESSAGES.SUCCESS;
      payload:
        | { output: Blob | null }
        | { textOutput: string }
        | {
            extraction: {
              columns?: string[];
              rows?: string[][];
              rowCount?: number;
              markdownContent?: string;
              pageCount?: number;
            };
            requestId?: string;
          };
    }
  | {
      type: typeof WORKER_MESSAGES.ERROR;
      payload: { message: string; requestId?: string };
    };

const ctx: Worker = self as any;
const controller = new PyodideController();

ctx.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  try {
    switch (type) {
      case WORKER_MESSAGES.INIT:
        await controller.init(payload.dependencies);
        postMessage({ type: WORKER_MESSAGES.READY });
        break;

      case WORKER_MESSAGES.RUN:
        const result = await controller.run(
          payload.script,
          payload.files,
          payload.textInputs,
          payload.outputFilename,
          payload.isTextOutput,
          (type, message) => {
            postMessage({
              type: WORKER_MESSAGES.LOG,
              payload: { type, message },
            });
          }
        );
        if (payload.isTextOutput) {
          postMessage({
            type: WORKER_MESSAGES.SUCCESS,
            payload: { textOutput: result as string },
          });
        } else {
          postMessage({
            type: WORKER_MESSAGES.SUCCESS,
            payload: { output: result as Blob | null },
          });
        }
        break;

      case WORKER_MESSAGES.EXTRACT:
        const { requestId } = payload;
        const pyodide = controller.getPyodide();
        if (!pyodide) {
          throw new Error(ERROR_MESSAGES.NOT_INITIALIZED);
        }
        const extraction = await extractFilePreview(
          payload.file,
          payload.sampleRows,
          pyodide,
          (dir) => controller.ensureDir(dir)
        );
        postMessage({
          type: WORKER_MESSAGES.SUCCESS,
          payload: { extraction, requestId },
        });
        break;
    }
  } catch (error: any) {
    postMessage({
      type: WORKER_MESSAGES.ERROR,
      payload: {
        message: error.message,
        requestId: 'requestId' in payload ? payload.requestId : undefined,
      },
    });
  }
};

function postMessage(message: WorkerResponse) {
  ctx.postMessage(message);
}
