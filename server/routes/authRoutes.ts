import * as express from 'express';

import {
  signUpWithEmail,
  signInWithEmail,
  signInWithProvider,
  signOut,
  getCurrentUser,
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signUpWithEmail);
router.post('/signin', signInWithEmail);
router.post('/signin/provider', signInWithProvider);
router.post('/signout', signOut);
router.get('/me', getCurrentUser);

export default router;
