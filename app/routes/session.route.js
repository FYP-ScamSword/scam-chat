import express from 'express';
import { getSessions, getSessionsAvailable, getSessionsByUserId, createSession } from '../controllers/session.controller.js';

const router = express.Router();

router.get('/all', getSessions);
router.get('/open', getSessionsAvailable);
router.get('/:user_id', getSessionsByUserId);

router.post('/', createSession);

export default router;
