# Script Execution Flow

This document explains how user actions in the UI trigger Python script
execution and file downloads.

## Overview

When a user clicks the action button (e.g., "Merge Files"), the system:

1. Collects uploaded files from the form
2. Sends them to a Web Worker running Pyodide (Python in the browser)
3. Executes a Python script that processes the files
4. Returns the output file and auto-downloads it

## Tech Stack

- **Frontend**: React + Mantine UI
- **Execution Engine**: [Pyodide](https://pyodide.org/) (Python 3.13 compiled to
  WebAssembly)
- **Architecture**: Web Worker (keeps heavy computation off the main thread)

## Step-by-Step Flow

### 1. User Interaction (`WorkflowForm.tsx`)

User uploads files and clicks the action button. The form:

- Collects uploaded files with their field IDs (e.g.,
  `{fieldId: 'source_files', file: ...}`)
- Retrieves the Python script and dependencies from the workflow definition
  (`execution?.dependencies`)
- Calls `run(script, filesWithFieldIds, outputFilename)` from the
  `usePyodideRunner` hook

### 2. Hook Preparation (`usePyodideRunner.ts`)

The hook:

- Converts files to `ArrayBuffer` format (binary data)
- Sends a `RUN` message to the Pyodide Web Worker with:
  - The Python script (string)
  - File buffers (array of `{ fieldId, name, content }`)
  - Expected output filename

### 3. Worker Routing (`pyodide.worker.ts`)

The worker receives the message and delegates to `PyodideController`.

### 4. Script Execution (`PyodideController.ts`)

The controller:

1. **Mounts files** to Pyodide's virtual file system at
   `/input_files/{fieldId}/`
2. **Captures logs** by hooking into Python's `stdout`/`stderr`
3. **Runs the script** using `pyodide.runPythonAsync(script)`
4. **Reads output** from `/output/` directory
5. **Auto-zips** if multiple files are generated
6. **Returns** the output as a `Blob`

### 5. Python Script Execution

The Python script (defined in `workflowsData.ts`) runs in the browser:

```python
import pandas as pd
import os

# Files are organized by field ID
FIELD_DIR = '/input_files/source_files'
files = os.listdir(FIELD_DIR)
df = pd.read_csv(f'{FIELD_DIR}/{files[0]}')

# Process data...

# Write output to /output/
df.to_csv('/output/result.csv', index=False)
```

**Key Points:**

- Scripts have access to installed packages (e.g., `pandas`, `numpy`)
- Input files are organized at `/input_files/{fieldId}/` (e.g.,
  `/input_files/source_files/`)
- Output must be written to `/output/`
- `print()` statements appear in the UI logs

### 6. Dependency Management

Python dependencies are specified per workflow in the `execution.dependencies` array:

- Frontend passes dependencies to the `usePyodideRunner` hook
- Worker installs packages on first run via micropip
- Packages persist in worker memory across executions
- Example: `["pandas", "numpy", "openpyxl"]`

### 7. Result Handling (`WorkflowForm.tsx`)

When the worker sends back a `SUCCESS` message:

- The hook updates state with the output `Blob`
- A `useEffect` triggers auto-download via a temporary `<a>` element
- Success alert shows with a fallback download link

## Technical Reference

### File System Mapping

| Location                  | Purpose                                        |
| ------------------------- | ---------------------------------------------- |
| `/input_files/{fieldId}/` | User-uploaded files organized by form field ID |
| `/output/`                | Script output files (read by controller)       |

### Error Handling

- **Timeout**: Scripts have 30 seconds to complete
- **Python errors**: Captured from `stderr` and displayed in the UI
- **Missing output**: If no file is found in `/output/`, an error is shown

### Performance Notes

- **First run**: ~2-3 seconds (loads Pyodide + dependencies)
- **Subsequent runs**: Near-instant (worker stays alive via singleton pattern)
- **Memory**: Worker persists across navigation to avoid re-initialization
