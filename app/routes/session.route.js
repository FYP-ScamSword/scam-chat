import express from 'express';
import { getSessions, getSessionsAvailable, getSessionsByUserId } from '../controllers/session.controller.js';

const router = express.Router();

router.get('/sessions/all', getSessions);
router.get('/sessions/open', getSessionsAvailable);
router.get('/sessions/:user_id', getSessionsByUserId);

export default router;
