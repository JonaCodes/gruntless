import * as express from 'express';

import { getCurrentUser } from '../controllers/authController';

const router = express.Router();

router.get('/me', getCurrentUser);

export default router;
