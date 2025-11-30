import { Router } from 'express';
import {
  createWorkflow,
  getWorkflow,
  sendMessage,
  approveWorkflow,
  editWorkflow,
  listWorkflows,
} from '../controllers/workflowsController';

const router = Router();

router.get('/', listWorkflows);
router.post('/', createWorkflow);
router.get('/:id', getWorkflow);
router.post('/:id/messages', sendMessage);
router.post('/:id/approve', approveWorkflow);
router.post('/:id/edit', editWorkflow);

export default router;
