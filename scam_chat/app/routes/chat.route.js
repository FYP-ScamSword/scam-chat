import express from 'express';
import { findChat, getLatestChat, getChatByNumberAndId, getAllChatsByNumber } from '../controllers/chat.controller.js';
const router = express.Router();

// Retrieve a chat with phone_num and tele handle
router.post('/get_msgs/:phone_num/:tele_handle', findChat);
router.get('/new_msgs/:phone_num', getLatestChat);
router.get('/get_by_id/:phone_num/:chat_id', getChatByNumberAndId);
router.get('/get_chats/:phone_num', getAllChatsByNumber);

export default router;
