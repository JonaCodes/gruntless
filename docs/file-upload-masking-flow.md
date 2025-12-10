# File Upload & Masking Flow

## Overview

Users upload files → Data extracted & masked locally in browser via Pyodide →
User approves sanitized previews → Only approved data sent to AI.

**Key Principle**: All file processing happens 100% locally. Raw data never
leaves the user's machine.

## Flow

1. User uploads file(s)
2. FileUploadSection triggers extraction for each file
3. Handler (CSV or PDF) generates unique requestId (prevents race conditions)
4. Pyodide worker runs Python script:
   - Extracts file structure (e.g., CSV columns + 3 sample rows)
   - Masks data (file-type specific character replacement)
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
- `pdfExtractor.ts` - Python script for PDF extraction + masking

**Handlers**

- `csv.ts` - CSVHandler generates requestId, correlates responses
- `pdf.ts` - PDFHandler generates requestId, correlates responses

## Technical Details

### Concurrent File Processing

- Multiple files uploaded → all sent to same shared worker
- Each request gets unique `requestId` via `crypto.randomUUID()`
- Responses matched to requests by `requestId` (prevents data mix-ups)

### Masking Strategy

Masking happens **in Python** during extraction (file-type specific):

**CSV:**
- Uppercase → `A`
- Lowercase → `a`
- Digit → `#`
- Punctuation preserved

**PDF:**
- Uppercase → `A`
- Lowercase → `a`
- Digit → `n`
- Safe keywords preserved unmasked ("Invoice", "Date", "Total", "Bill", etc.)
- Text without keywords → `**REDACTED**`

### State Management

```typescript
uploadedFiles: FileWithPath[]                // Original files
extractedFiles: Record<fileName, extract>    // Masked previews
extractionStatus: Record<fileName, status>   // 'extracting' | 'success' | 'error'
extractionErrors: Record<fileName, error>    // Error messages if extraction fails
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
