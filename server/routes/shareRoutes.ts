import { Router } from 'express';
import { createShare, acceptShare } from '../controllers/sharesController';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, createShare);
router.post('/accept', requireAuth, acceptShare);

export default router;
