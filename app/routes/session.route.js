import express from 'express';
import { getSessions, getSessionsAvailable, getSessionsByUserId, assignSessionByUserId, createSession } from '../controllers/session.controller.js';

const router = express.Router();

router.get('/all', getSessions);
router.get('/open', getSessionsAvailable);
router.get('/:user_id', getSessionsByUserId);

router.post('/', createSession);
router.post('/:user_id', assignSessionByUserId);

export default router;
