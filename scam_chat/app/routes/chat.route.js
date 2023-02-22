import express from 'express';
import { findChat, getLatestChat } from '../controllers/chat.controller.js';
const router = express.Router();

// Retrieve a chat with phone_num and tele handle
router.post('/get_msgs/:phone_num/:tele_handle', findChat);
router.get('/new_msgs/:phone_num', getLatestChat);

export default router;
