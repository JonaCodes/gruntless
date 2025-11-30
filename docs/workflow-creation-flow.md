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

**Masking rules:** | Character Type | Replacement |
|----------------|-------------| | Uppercase letter | `A` | | Lowercase letter |
`a` | | Digit | `#` | | Punctuation/symbols | Keep as-is |

**Examples:**

- `\"PROD-194211\"` → `\"AAAA-######\"`
- `\"John Smith\"` → `\"Aaaa Aaaaa\"`
- `\"john.smith@acme.com\"` → `\"aaaa.aaaaa@aaaa.aaa\"`
- `\"2024-01-15\"` → `\"####-##-##\"`
- `\"$1,234.56\"` → `\"$#,###.##\"`

## Supported File Types

File extraction is handled by type-specific extractors. Each extractor
implements the same interface but extracts different metadata appropriate to the
file type.

**Currently supported:**

- CSV: Extracts column names, row count, sample rows (masked)

**Planned:**

- Excel (.xlsx, .xls): Same as CSV, per sheet
- PDF: Page count, detected tables (if any), text preview (masked)
- Word (.docx): Section headings, text preview (masked)
- Images: Dimensions, format, detected text via OCR (masked)

No need to implement handling for all of these now - just stubs.

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

## Workflow Version Statuses

Status lives on `workflow_versions`, not on the workflow itself.

**Status transitions:**

1. `validating` → `validated` (if feasible) OR `rejected` (if not feasible)
2. `validated` → `clarifying` (auto-transition, always)
3. `clarifying` → `clarifying` (if LLM needs more info) OR `building` (if LLM
   has enough)
4. `building` → `pending_user_approval` (when script generation completes) OR
   `failed` (if build fails)
5. `pending_user_approval` → `approved` (user approves) OR new version created
   with status `validated` (user clicks edit)
6. `approved` → terminal state (but user can create new version to edit)
7. `rejected` → terminal state
8. `failed` → terminal state
9. Any status → `archived` (when a new version is created, previous versions are
   archived)

**Note:** Only one version can have a "real" status (active draft or approved)
at a time. All older versions are moved to `archived` status.

## API Endpoints

### `POST /api/workflows`

Creates a new workflow and initial draft version with file extracts.

**Request:**

```json
{
  \"file_extracts\": [
    {
      \"filename\": \"sales.csv\",
      \"columns\": [\"date\", \"product_id\", \"revenue\"],
      \"sample_rows\": [[\"####-##-##\", \"AAAA-####\", \"$#,###.##\"]],
      \"row_count\": 1542
    }
  ]
}
```

**Response:**

```json
{
  \"workflow_id\": \"wf_abc123\",
  \"version_id\": \"wv_xyz789\",
  \"status\": \"validating\"
}
```

### `POST /api/workflows/:id/messages`

Send a message in the conversation. Server routes to appropriate LLM based on
current draft version's status.

**Request:**

```json
{
  \"content\": \"merge these files by the date column\"
}
```

**Response:**

```json
{
  \"status\": \"clarifying\",
  \"message\": \"Should I keep all columns from both files, or just specific ones?\"
}
```

Or when clarification is complete:

```json
{
  \"status\": \"building\",
  \"message\": \"Got it! Building your workflow now...\"
}
```

### `GET /api/workflows/:id`

Get workflow with current version info. Used for polling when status is
`building`.

**Response (while building):**

```json
{
  \"id\": \"wf_abc123\",
  \"current_version\": {
    \"id\": \"wv_xyz789\",
    \"status\": \"building\"
  }
}
```

**Response (build complete):**

```json
{
  \"id\": \"wf_abc123\",
  \"name\": \"Sales Data Merger\",
  \"description\": \"Merges CSV files by date column\",
  \"current_version\": {
    \"id\": \"wv_xyz789\",
    \"status\": \"pending_user_approval\",
    \"fields\": [ ... ],
    \"execution\": { ... }
  }
}
```

## Server-Side Message Handling

**Concurrency Control:** Only one message can be processed at a time. The client
must wait for the response before allowing the user to send another message.

When a message is received, the handler checks the draft version's status and
routes accordingly:

| Current Status          | Action                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `validating`            | Run validator LLM → either reject or move to `validated`                           |
| `validated`             | Run clarifier LLM → either ask question (`clarifying`) or start build (`building`) |
| `clarifying`            | Run clarifier LLM → either ask another question or start build                     |
| `building`              | Reject message (client shouldn't send during build)                                |
| `pending_user_approval` | User wants changes → create new version with status `validated`, run clarifier     |

## LLM Responsibilities

**Validator LLM**

- Input: file extracts + user's task description
- Output: `{ feasible: boolean, reason?: string }`
- Purpose: Reject tasks that require ML/AI/image processing/etc.

**Clarifier LLM**

- Input: file extracts + full conversation history
- Output: `{ needs_clarification: boolean, question?: string }`
- Purpose: Gather enough detail to write the script

**Builder LLM**

- Input: file extracts + full conversation history
- Output: Complete workflow JSON (name, description, fields, script)
- Purpose: Generate the actual Python script and UI definition

## Build Process

When clarification is complete:

1. Server sets version status to `building`
2. Server kicks off async build task (does not await)
3. Server returns `{ status: "building", message: "..." }` immediately
4. Client starts polling `GET /api/workflows/:id` every 1 second
5. Build task runs builder LLM, generates script
6. Build task updates version status to `pending_user_approval`, saves
   fields/execution
7. **Auto-Testing:**
   - Client detects script availability (via polling)
   - Client fetches the script and runs a local test (stubbed for now to always
     return 'success')
   - If test fails, client reports failure (future implementation)
8. If first version: LLM-generated name/description saved to workflow
9. Client poll sees new status, stops polling
10. Client redirects to `/workflows` page

## Post-Build User Flow

On `/workflows` page, the new workflow appears with draft version in
`pending_user_approval` status:

- **Approve**: Version status → `approved`, `is_active` → `true`, workflow is
  now usable
- **Edit**: Creates new version (version + 1) with status `validated`, copies
  file_extracts from previous version, redirects to chat interface, conversation
  continues

When editing, user can send additional messages like \"actually, also filter out
rows where revenue is null\" and the clarify/build cycle runs again.

## Data Model

Three tables: `workflows` (identity/metadata), `workflow_versions`
(implementations), `workflow_messages` (conversation history).

### workflows

The workflow's identity. Name, description, and label are auto-generated by the
LLM on first build, then only editable manually via UI.

| Column      | Type             | Notes                                                 |
| ----------- | ---------------- | ----------------------------------------------------- |
| id          | PK               |                                                       |
| account_id  | FK               | For RLS                                               |
| user_id     | FK               |                                                       |
| name        | string           | Auto-generated on first build, then manually editable |
| description | string           | Auto-generated on first build, then manually editable |
| label       | string, nullable | User-generated tag, e.g. \"finance\", \"sales\"       |
| created_at  | timestamp        |                                                       |
| updated_at  | timestamp        |                                                       |

### workflow_versions

The implementation details. Each approved version is a snapshot. Only one draft
(non-approved status) at a time per workflow.

| Column           | Type             | Notes                                                                                                    |
| ---------------- | ---------------- | -------------------------------------------------------------------------------------------------------- |
| id               | PK               |                                                                                                          |
| workflow_id      | FK               |                                                                                                          |
| account_id       | FK               | For RLS                                                                                                  |
| version          | int              | 1, 2, 3...                                                                                               |
| status           | enum             | validating, validated, clarifying, building, pending_user_approval, approved, rejected, failed, archived |
| is_active        | boolean          | Only one active version per workflow                                                                     |
| file_extracts    | JSONB            | Array of FileExtract objects                                                                             |
| fields           | JSONB, nullable  | Set during build                                                                                         |
| execution        | JSONB, nullable  | Set during build                                                                                         |
| rejection_reason | string, nullable | Set if rejected                                                                                          |
| created_at       | timestamp        |                                                                                                          |
| updated_at       | timestamp        |                                                                                                          |

### workflow_messages

Conversation history. Tied to workflow (not version) so LLM has full context
across edits.

| Column      | Type      | Notes           |
| ----------- | --------- | --------------- |
| id          | PK        |                 |
| workflow_id | FK        |                 |
| account_id  | FK        | For RLS         |
| role        | enum      | user, assistant |
| content     | text      |                 |
| created_at  | timestamp |                 |

### Constraints

- Only one version per workflow can have `is_active = true`
