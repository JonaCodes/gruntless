/* eslint-disable no-restricted-globals */
import { loadPyodide, PyodideInterface } from 'pyodide';
import {
  PYODIDE_CONFIG,
  LOG_TYPES,
  ERROR_MESSAGES,
} from '../../consts/pyodide';

export class PyodideController {
  private pyodide: PyodideInterface | null = null;
  private initPromise: Promise<void> | null = null;

  async init(dependencies: string[]) {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = (async () => {
      if (!this.pyodide) {
        this.pyodide = await loadPyodide({
          indexURL: PYODIDE_CONFIG.INDEX_URL,
        });
      }

      // Install dependencies
      if (dependencies.length > 0) {
        await this.pyodide.loadPackage(PYODIDE_CONFIG.PACKAGES.MICROPIP);
        const micropip = this.pyodide.pyimport(
          PYODIDE_CONFIG.PACKAGES.MICROPIP
        );
        await micropip.install(dependencies);
      }

      // Setup File System
      this.ensureDir(PYODIDE_CONFIG.DIRS.INPUT);
      this.ensureDir(PYODIDE_CONFIG.DIRS.OUTPUT);
    })();

    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }

  async run(
    script: string,
    files: { fieldId: string; name: string; content: ArrayBuffer }[],
    outputFilename: string,
    onLog: (type: 'stdout' | 'stderr', message: string) => void
  ): Promise<Blob | null> {
    if (this.initPromise) {
      await this.initPromise;
    }

    if (!this.pyodide) {
      throw new Error(ERROR_MESSAGES.NOT_INITIALIZED);
    }

    try {
      // 1. Cleanup previous run
      this.cleanDir(PYODIDE_CONFIG.DIRS.INPUT);
      this.cleanDir(PYODIDE_CONFIG.DIRS.OUTPUT);

      // 2. Mount Input Files in field-specific subdirectories
      for (const file of files) {
        const fieldDir = `${PYODIDE_CONFIG.DIRS.INPUT}/${file.fieldId}`;
        this.ensureDir(fieldDir);
        this.pyodide.FS.writeFile(
          `${fieldDir}/${file.name}`,
          new Uint8Array(file.content)
        );
      }

      // 3. Capture stdout/stderr
      this.pyodide.setStdout({
        batched: (msg: string) => onLog(LOG_TYPES.STDOUT, msg),
      });
      this.pyodide.setStderr({
        batched: (msg: string) => onLog(LOG_TYPES.STDERR, msg),
      });

      // 4. Execute Script
      await this.pyodide.runPythonAsync(script);

      // 5. Read Output
      let finalOutputPath = `${PYODIDE_CONFIG.DIRS.OUTPUT}/${outputFilename}`;
      let wasAutoZipped = false;

      if (!this.pyodide.FS.analyzePath(finalOutputPath).exists) {
        // Check if we have any files in output
        const outputFiles = this.pyodide.FS.readdir(
          PYODIDE_CONFIG.DIRS.OUTPUT
        ).filter((f: string) => f !== '.' && f !== '..');

        if (outputFiles.length > 0) {
          // Auto-zip
          const tempZipName = PYODIDE_CONFIG.AUTO_ZIP.NAME;
          const zipScript = `
import shutil
shutil.make_archive('/${tempZipName}', 'zip', '${PYODIDE_CONFIG.DIRS.OUTPUT}')
`;
          await this.pyodide.runPythonAsync(zipScript);

          finalOutputPath = `/${tempZipName}.zip`;
          wasAutoZipped = true;
        }
      }

      let outputBlob: Blob | null = null;
      if (this.pyodide.FS.analyzePath(finalOutputPath).exists) {
        const fileContent = this.pyodide.FS.readFile(finalOutputPath);
        outputBlob = new Blob([fileContent], {
          type: wasAutoZipped ? 'application/zip' : 'application/octet-stream',
        });
      }

      // 6. Cleanup
      this.cleanDir(PYODIDE_CONFIG.DIRS.INPUT);
      // Clear temp zip if created
      if (wasAutoZipped) {
        try {
          this.pyodide.FS.unlink(finalOutputPath);
        } catch (e) {
          // Ignore unlink errors
        }
      }

      return outputBlob;
    } finally {
      // Reset stdout/stderr to avoid leaking logs to next run or init
      if (this.pyodide) {
        this.pyodide.setStdout({ batched: () => {} });
        this.pyodide.setStderr({ batched: () => {} });
      }
    }
  }

  private ensureDir(dir: string) {
    if (this.pyodide && !this.pyodide.FS.analyzePath(dir).exists) {
      this.pyodide.FS.mkdir(dir);
    }
  }

  private cleanDir(dir: string) {
    if (!this.pyodide) return;

    const files = this.pyodide.FS.readdir(dir);
    for (const file of files) {
      if (file !== '.' && file !== '..') {
        const fullPath = `${dir}/${file}`;
        try {
          const stat = this.pyodide.FS.stat(fullPath);
          if (this.pyodide.FS.isDir(stat.mode)) {
            // Recursively clean subdirectory, then remove it
            this.cleanDir(fullPath);
            this.pyodide.FS.rmdir(fullPath);
          } else {
            this.pyodide.FS.unlink(fullPath);
          }
        } catch (e) {
          // Ignore errors
        }
      }
    }
  }
}
