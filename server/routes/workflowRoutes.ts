import { Router } from 'express';
import {
  createWorkflow,
  getWorkflow,
  sendMessage,
  approveWorkflow,
  editWorkflow,
  listWorkflows,
  seedWorkflow,
} from '../controllers/workflowsController';
import { requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', listWorkflows);
router.post('/', createWorkflow);
router.post('/admin/seed', requireAdmin, seedWorkflow);
router.get('/:id', getWorkflow);
router.post('/:id/messages', sendMessage);
router.post('/:id/approve', approveWorkflow);
router.post('/:id/edit', editWorkflow);

export default router;
