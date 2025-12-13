import { Router } from 'express';
import {
  getTopUsers,
  getUserWorkflows,
  deleteUser,
} from '../controllers/backofficeController';

const router = Router();

// All routes require admin authentication at middleware level
router.get('/users', getTopUsers);
router.get('/users/:userId/workflows', getUserWorkflows);
router.delete('/users/:userId', deleteUser);

export default router;
