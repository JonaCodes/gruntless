# Workflow Tables Architecture

## Overview

Workflows in Gruntless use a **Git-like fork model**: when users share
workflows, each user gets their own independent copy. Edits don't affect other
users' versions.

---

## Core Tables

### `workflows`

The main table. Each row is a workflow snapshot owned by a specific user.

**Key Fields:**

- `user_id` - Owner of this workflow
- `account_id` - Account this workflow belongs to (for quotas/billing/RLS)
- `parent_workflow_id` - The workflow this was forked from (null for originals)
- `root_workflow_id` - The original ancestor (for tracking the "workflow
  family")
- `version` - Version number within this user's fork chain
- `status` - Lifecycle: `validating`, `building`, `approved`, etc.
- `fields` (JSONB) - Input field definitions
- `execution` (JSONB) - Python script + dependencies + output filename
- `file_extracts` (JSONB) - Sample data from uploaded files

Use `workflow_runs` as single source of truth for run stats.

---

### `workflow_runs`

Event log of every workflow execution.

**Key Fields:**

- `workflow_id` - Which workflow was run
- `user_id` - Who ran it
- `success` - Boolean: did it succeed?
- `created_at` - When it ran

**Usage:** Aggregate by `root_workflow_id` to track total runs for a "workflow
concept" across all forks.

---

### `workflow_shares`

Tracks who shared workflows with whom.

**Key Fields:**

- `id` - Short share code (e.g., "a3f7k2m9")
- `workflow_id` - The workflow being shared
- `shared_by` - User who created the share link
- `shared_with` - User who accepted it (nullable until acceptance)
- `accepted_at` - Timestamp of acceptance

**No `account_id`**: Intentional. Allows cross-account sharing.

**On acceptance:** Creates a forked workflow owned by the accepting user (see
Fork Model below).

---

### `workflow_messages`

AI conversation history for building workflows.

**Key Fields:**

- `workflow_id` - Which workflow this conversation belongs to
- `role` - `'user'` or `'assistant'`
- `content` - Message text

**Forking behavior:** Messages stay with their original workflow. To show full
context for a fork, traverse up the `parent_workflow_id` chain.

---

## Fork Model

### How Forking Works

1. **User A creates Workflow 1** (root)

   ```
   id=1, user_id=A, parent_id=NULL, root_id=NULL
   ```

2. **User A shares with User B**

   - Creates `WorkflowShare` with a short code

3. **User B accepts the share**

   - Creates **Workflow 3** (User B's fork):
     ```
     id=3, user_id=B, parent_id=1, root_id=1
     ```
   - Copies fields/execution from Workflow 1
   - Sets `status='approved'` (forks start approved)
   - Uses **User B's `account_id`** (not User A's)

4. **User A and User B edit independently**
   - User A's edit → creates Workflow 2 (parent=1, root=1)
   - User B's edit → creates Workflow 4 (parent=3, root=1)
   - No cross-contamination

### The `root_workflow_id`

Points to the **original ancestor** of the workflow family.

**Purpose:** Track the "workflow concept" for aggregated metrics.

**Example:** "Merge CSVs" workflow might have:

- Workflow 1 (root, User A)
- Workflow 2 (User A's edit, root=1)
- Workflow 3 (User B's fork, root=1)
- Workflow 4 (User B's edit, root=1)

Query: "How many times has User A run 'Merge CSVs'?"

```sql
SELECT COUNT(*) FROM workflow_runs
WHERE user_id = A
  AND workflow_id IN (
    SELECT id FROM workflows
    WHERE root_workflow_id = 1 OR id = 1
  );
```

---

## Run Tracking Pattern

Query `workflow_runs` directly.

```typescript
// Get stats for a workflow
const stats = await WorkflowRun.findAll({
  where: {
    userId,
    workflowId: { [Op.in]: workflowIds },
    success: true,
  },
  attributes: [
    [fn('COUNT', col('id')), 'numRuns'],
    [fn('MAX', col('created_at')), 'lastRun'],
  ],
});
```

**Rationale:** Single source of truth, no sync issues, simple model.
