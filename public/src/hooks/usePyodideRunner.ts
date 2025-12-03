import { useState, useEffect, useRef, useCallback } from 'react';
import { FileWithPath } from '@mantine/dropzone';
import {
  WORKER_MESSAGES,
  EXECUTION_STATUS,
  ERROR_MESSAGES,
  PYODIDE_CONFIG,
} from '../consts/pyodide';
import PyodideWorkerManager from '../workers/pyodide/PyodideWorkerManager';

interface PyodideRunnerOptions {
  dependencies?: string[];
}

interface PyodideRunnerState {
  status:
    | typeof EXECUTION_STATUS.IDLE
    | typeof EXECUTION_STATUS.LOADING
    | typeof EXECUTION_STATUS.RUNNING
    | typeof EXECUTION_STATUS.SUCCESS
    | typeof EXECUTION_STATUS.ERROR;
  error: string | null;
  output: Blob | null;
  logs: { type: 'stdout' | 'stderr'; message: string }[];
}

export const usePyodideRunner = (options: PyodideRunnerOptions = {}) => {
  const [state, setState] = useState<PyodideRunnerState>({
    status: EXECUTION_STATUS.IDLE,
    error: null,
    output: null,
    logs: [],
  });

  const workerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isReadyRef = useRef(false);

  useEffect(() => {
    const manager = PyodideWorkerManager.getInstance();
    const worker = manager.getWorker();
    workerRef.current = worker;

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;

      switch (type) {
        case WORKER_MESSAGES.LOG:
          // Avoids unneccessary log updates if we are idle
          setState((prev) => {
            if (prev.status === EXECUTION_STATUS.IDLE) return prev;
            return {
              ...prev,
              logs: [...prev.logs, payload],
            };
          });
          break;
        case WORKER_MESSAGES.SUCCESS:
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setState((prev) => ({
            ...prev,
            status: EXECUTION_STATUS.SUCCESS,
            output: payload.output,
          }));
          break;
        case WORKER_MESSAGES.ERROR:
          if (timeoutRef.current) clearTimeout(timeoutRef.current);
          setState((prev) => ({
            ...prev,
            status: EXECUTION_STATUS.ERROR,
            error: payload.message,
          }));
          break;
      }
    };

    const unsubscribe = manager.subscribe(handleMessage);

    manager.ensureInitialized(options.dependencies || []).then(() => {
      isReadyRef.current = true;
    });

    return () => {
      unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [options.dependencies]);

  const run = useCallback(
    async (
      script: string,
      files: { fieldId: string; file: FileWithPath }[],
      outputFilename: string
    ) => {
      if (!workerRef.current) return;

      setState((prev) => ({
        ...prev,
        status: EXECUTION_STATUS.RUNNING,
        error: null,
        output: null,
        logs: [],
      }));

      const fileBuffers = await Promise.all(
        files.map(async ({ fieldId, file }) => ({
          fieldId,
          name: file.name,
          content: await file.arrayBuffer(),
        }))
      );

      workerRef.current.postMessage({
        type: WORKER_MESSAGES.RUN,
        payload: {
          script,
          files: fileBuffers,
          outputFilename,
        },
      });

      timeoutRef.current = setTimeout(() => {
        PyodideWorkerManager.getInstance().terminate();
        workerRef.current = null; // Force re-initialization on next run
        isReadyRef.current = false;

        setState((prev) => ({
          ...prev,
          status: EXECUTION_STATUS.ERROR,
          error: ERROR_MESSAGES.TIMEOUT,
        }));
      }, PYODIDE_CONFIG.TIMEOUT_MS);
    },
    []
  );

  return {
    ...state,
    run,
  };
};
