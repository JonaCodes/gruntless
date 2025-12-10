This document describes how users create new automated workflows via natural
language conversation.

## Overview

Users upload files, approve sanitized data extracts, then chat with an AI to
describe what they want. The system validates feasibility, asks clarifying
questions if needed, generates a Python script, and lets users test before
approving.

## UI Layout

**Left side (30%):** Chat interface with text input at bottom

**Right side (70%):** File upload area

- Upload box that accepts multiple files
- Each uploaded file shows as a chip (with remove option)
- Below chips: data approval interface showing sanitized extracts
- User must approve data before chat is enabled

## Data Extraction & Masking

When files are uploaded, we extract metadata locally (never sent to server until
approved):

```typescript
interface FileExtract {
  filename: string;
  columns: string[]; // Real column names - kept as-is
  sample_rows: string[][]; // Masked values
  row_count: number;
}
```

**Masking rules:**

| Character Type | CSV Replacement | PDF Replacement |
|----------------|-----------------|-----------------|
| Uppercase letter | `A` | `A` |
| Lowercase letter | `a` | `a` |
| Digit | `#` | `n` |
| Punctuation/symbols | Keep as-is | Keep as-is |

**CSV Examples:**

- `"PROD-194211"` → `"AAAA-######"`
- `"John Smith"` → `"Aaaa Aaaaa"`
- `"john.smith@acme.com"` → `"aaaa.aaaaa@aaaa.aaa"`
- `"2024-01-15"` → `"####-##-##"`
- `"$1,234.56"` → `"$#,###.##"`

**PDF Examples:**

- `"Invoice #12345"` → `"Invoice #nnnnn"` (keywords preserved)
- `"Bill Date: 2024-01-15"` → `"Bill Date: nnnn-nn-nn"` (keywords preserved)
- Other text without keywords → `"**REDACTED**"`

## Supported File Types

File extraction is handled by type-specific extractors. Each extractor
implements the same interface but extracts different metadata appropriate to the
file type.

**Currently supported:**

- CSV: Extracts column names, row count, sample rows (masked)
- PDF: Page count, detected tables (if any), text preview (masked with keyword preservation)

**Planned:**

- Excel (.xlsx, .xls): Same as CSV, per sheet
- Word (.docx): Section headings, text preview (masked)
- Images: Dimensions, format, detected text via OCR (masked)

**Extractor interface:**

```typescript
interface FileExtractor {
  supports(mimeType: string): boolean;
  extract(file: File): Promise<FileExtract>;
}
```

The extraction pipeline checks each registered extractor and uses the first one
that supports the file's MIME type. Unsupported file types are rejected with a
clear error message.

## Database Schema

See `workflow-tables.md` for complete database architecture, fork model, and run tracking.

## Planned Features

### Validation & Clarification Flow
Multi-step workflow creation where users chat with AI to build workflows. Initial uploads start with `validating` status, transition through `clarifying`, then `building`.

### Message Handling & LLMs
Status-based routing to validator/clarifier/builder LLMs via `POST /api/workflows/:id/messages`. Each LLM has specific responsibilities (feasibility check, requirement gathering, script generation).

### Status Transitions
Lifecycle: `validating` → `needs_info` → `building` → `pending_approval` → `approved`. Failed builds move to `failed` or `rejected` states. Previous versions archived when new versions created.

### Approval & Edit Endpoints
`POST /api/workflows/:id/approve` sets status to approved. `POST /api/workflows/:id/edit` creates new version for modifications. Only one active version per workflow.

### Version History
Track multiple versions of workflows. When editing, create new version and archive previous. Each version maintains its own status and implementation details.
