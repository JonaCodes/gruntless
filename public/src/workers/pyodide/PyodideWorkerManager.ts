import { WORKER_MESSAGES } from '../../consts/pyodide';

type MessageHandler = (event: MessageEvent) => void;

class PyodideWorkerManager {
  private static instance: PyodideWorkerManager;
  private worker: Worker | null = null;
  private listeners: Set<MessageHandler> = new Set();
  private initPromise: Promise<void> | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

  public static getInstance(): PyodideWorkerManager {
    if (!PyodideWorkerManager.instance) {
      PyodideWorkerManager.instance = new PyodideWorkerManager();
    }
    return PyodideWorkerManager.instance;
  }

  public getWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker(
        new URL('../pyodide.worker.ts', import.meta.url),
        { type: 'module' }
      );
      this.worker.onmessage = (event) => {
        this.listeners.forEach((listener) => listener(event));
      };
    }
    return this.worker;
  }

  public async ensureInitialized(dependencies: string[] = []): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      const worker = this.getWorker();

      const handleReady = (event: MessageEvent) => {
        if (event.data.type === WORKER_MESSAGES.READY) {
          this.isInitialized = true;
          this.initPromise = null;
          worker.removeEventListener('message', handleReady);
          worker.removeEventListener('message', handleError);
          resolve();
        }
      };

      const handleError = (event: MessageEvent) => {
        if (event.data.type === WORKER_MESSAGES.ERROR) {
          this.initPromise = null;
          worker.removeEventListener('message', handleReady);
          worker.removeEventListener('message', handleError);
          reject(new Error(event.data.payload.message));
        }
      };

      worker.addEventListener('message', handleReady);
      worker.addEventListener('message', handleError);

      worker.postMessage({
        type: WORKER_MESSAGES.INIT,
        payload: { dependencies },
      });
    });

    return this.initPromise;
  }

  public subscribe(listener: MessageHandler) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.listeners.clear();
      this.isInitialized = false;
      this.initPromise = null;
    }
  }
}

export default PyodideWorkerManager;
