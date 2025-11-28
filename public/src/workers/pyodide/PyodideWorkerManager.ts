type MessageHandler = (event: MessageEvent) => void;

class PyodideWorkerManager {
  private static instance: PyodideWorkerManager;
  private worker: Worker | null = null;
  private listeners: Set<MessageHandler> = new Set();

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

  public subscribe(listener: MessageHandler) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.listeners.clear();
    }
  }
}

export default PyodideWorkerManager;
