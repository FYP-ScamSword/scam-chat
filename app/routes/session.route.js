import express from 'express';
import { getSessions, getSessionsAvailable, getSessionsByUserId, createSession } from '../controllers/session.controller.js';

const router = express.Router();

router.get('/sessions/all', getSessions);
router.get('/sessions/open', getSessionsAvailable);
router.get('/sessions/:user_id', getSessionsByUserId);

router.post('/sessions', createSession);

export default router;
