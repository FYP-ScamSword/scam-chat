import express from 'express';
import { getSessions, getSessionsAvailable, getSessionsByUsername, assignSessionByUsername, createSession } from '../controllers/session.controller.js';

const router = express.Router();

router.get('/all', getSessions);
router.get('/open', getSessionsAvailable);
router.get('/:username', getSessionsByUsername);

router.post('/', createSession);
router.post('/:username', assignSessionByUsername);

export default router;
