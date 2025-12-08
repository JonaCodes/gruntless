import { Router } from 'express';
import {
  createWorkflow,
  getWorkflow,
  sendMessage,
  approveWorkflow,
  editWorkflow,
  listWorkflows,
  seedWorkflow,
  recordWorkflowRun,
} from '../controllers/workflowsController';
import { requireAdmin } from '../middleware/auth';
import { validateWorkflowRunBody } from '../middleware/validators';

const router = Router();

router.get('/', listWorkflows);
router.post('/', createWorkflow);
router.post('/admin/seed', requireAdmin, seedWorkflow);
router.get('/:id', getWorkflow);
router.post('/:id/messages', sendMessage);
router.post('/:id/approve', approveWorkflow);
router.post('/:id/edit', editWorkflow);
router.post('/:id/runs', validateWorkflowRunBody, recordWorkflowRun);

export default router;
