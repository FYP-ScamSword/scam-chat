
import express from 'express';
import { getAllUsers, getUserByNum, createUser } from '../controllers/tele_user.controller.js';
const router = express.Router();

// Create a new user
router.post('/', createUser);

// Retrieve all users
router.get('/', getAllUsers);

// Retrieve a single user with number
router.get('/:phone_num', getUserByNum);

export default router;
