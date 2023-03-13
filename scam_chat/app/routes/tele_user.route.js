
import express from 'express';
import { getAllUsers, getUserByNum, createUser } from '../controllers/tele_user.controller.js';
const router = express.Router();

router.post('/', createUser);

router.get('/', getAllUsers);

router.get('/:user_id', getUserByNum);

export default router;
