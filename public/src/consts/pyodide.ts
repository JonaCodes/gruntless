export const PYODIDE_CONFIG = {
  INDEX_URL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
  PACKAGES: {
    MICROPIP: 'micropip',
  },
  DIRS: {
    INPUT: '/input_files',
    OUTPUT: '/output',
  },
  AUTO_ZIP: {
    NAME: 'gruntless_auto_output',
  },
  TIMEOUT_MS: 30_000,
};

export const WORKER_MESSAGES = {
  INIT: 'INIT',
  RUN: 'RUN',
  READY: 'READY',
  LOG: 'LOG',
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

export const LOG_TYPES = {
  STDOUT: 'stdout',
  STDERR: 'stderr',
} as const;

export const EXECUTION_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  RUNNING: 'running',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export const ERROR_MESSAGES = {
  NOT_INITIALIZED: 'Pyodide not initialized',
  TIMEOUT: 'Execution timed out (30s limit exceeded)',
};
