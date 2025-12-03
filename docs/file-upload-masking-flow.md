# File Upload & Masking Flow

## Overview

Users upload files → Data extracted & masked locally in browser via Pyodide →
User approves sanitized previews → Only approved data sent to AI.

**Key Principle**: All file processing happens 100% locally. Raw data never
leaves the user's machine.

## Flow

1. User uploads file(s)
2. FileUploadSection triggers extraction for each file
3. CSVHandler generates unique requestId (prevents race conditions)
   - Future: PDFHandler, ExcelHandler, etc.
4. Pyodide worker runs Python script:
   - Extracts file structure (e.g., CSV columns + 3 sample rows)
   - Masks data (A/a/# character replacement)
   - Returns masked preview
5. Masked data stored in workflowFilesStore (MobX)
6. FilePreviewSection displays carousel of masked previews
7. User approves/rejects each file
8. Only approved files proceed to AI workflow builder

## Key Components

**Frontend**

- `FileUploadSection.tsx` - Dropzone, triggers extraction
- `FilePreviewSection.tsx` - Carousel of masked previews with approve/reject
- `workflowFilesStore.ts` - MobX state (files, extracts, status, approvals)

**Worker Layer**

- `pyodide.worker.ts` - Routes messages to extractors
- `PyodideWorkerManager.ts` - Singleton worker (shared across all extractions)
- `csvExtractor.ts` - Python script for CSV extraction + masking

**Handlers**

- `csv.ts` - CSVHandler generates requestId, correlates responses

## Technical Details

### Concurrent File Processing

- Multiple files uploaded → all sent to same shared worker
- Each request gets unique `requestId` via `crypto.randomUUID()`
- Responses matched to requests by `requestId` (prevents data mix-ups)

### Masking Strategy

- **CSV**: Simple character replacement (uppercase→A, lowercase→a, digit→#)
- **Future (PDF)**: Keyword preservation ("Invoice:", "Date:" stay unmasked)
- Masking happens **in Python** during extraction (file-type specific)

### State Management

```typescript
uploadedFiles: FileWithPath[]                // Original files
extractedFiles: Record<fileName, extract>    // Masked previews
extractionStatus: Record<fileName, status>   // 'extracting' | 'success' | 'error'
approvedFiles: Set<fileName>                 // Which files user approved
```

## Adding New File Types

1. Create Python extractor in `workers/pyodide/extractors/`
2. Implement file-specific masking in Python
3. Add handler in `lib/file-extraction/handlers/`
4. Create preview component in `file_area/previews/`
5. Update routing in `fileExtractor.ts` and `handlers/index.ts`

## Why This Architecture?

- **Pyodide**: Run Python (pandas, etc.) in browser for local data processing
- **Shared Worker**: Single Pyodide instance (~50MB) reused across extractions
- **Request IDs**: Handle concurrent extractions without response confusion
- **Python Masking**: File-type specific logic, easier than generic TypeScript
  layer
- **MobX**: Reactive UI updates as files progress through extraction
