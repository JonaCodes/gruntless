/* eslint-disable no-restricted-globals */
import { PyodideController } from './pyodide/PyodideController';
import { WORKER_MESSAGES } from '../consts/pyodide';

// Define types for the worker messages
type WorkerMessage =
  | { type: typeof WORKER_MESSAGES.INIT; payload: { dependencies: string[] } }
  | {
      type: typeof WORKER_MESSAGES.RUN;
      payload: {
        script: string;
        files: { fieldId: string; name: string; content: ArrayBuffer }[];
        outputFilename: string;
      };
    };

type WorkerResponse =
  | { type: typeof WORKER_MESSAGES.READY }
  | {
      type: typeof WORKER_MESSAGES.LOG;
      payload: { type: 'stdout' | 'stderr'; message: string };
    }
  | { type: typeof WORKER_MESSAGES.SUCCESS; payload: { output: Blob | null } }
  | { type: typeof WORKER_MESSAGES.ERROR; payload: { message: string } };

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
        const output = await controller.run(
          payload.script,
          payload.files,
          payload.outputFilename,
          (type, message) => {
            postMessage({
              type: WORKER_MESSAGES.LOG,
              payload: { type, message },
            });
          }
        );
        postMessage({ type: WORKER_MESSAGES.SUCCESS, payload: { output } });
        break;
    }
  } catch (error: any) {
    postMessage({
      type: WORKER_MESSAGES.ERROR,
      payload: { message: error.message },
    });
  }
};

function postMessage(message: WorkerResponse) {
  ctx.postMessage(message);
}
