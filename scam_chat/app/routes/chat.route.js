import express from 'express';
import { findChat, createChat, getLatestChat, getChatByNumberAndId, getAllChatsByNumber, updateChat } from '../controllers/chat.controller.js';
const router = express.Router();

router.post('/get_msgs/:phone_num/:tele_handle', findChat);

router.post('/createchat', createChat);

router.get('/new_msgs/:phone_num', getLatestChat);

router.get('/get_by_id/:phone_num/:chat_id', getChatByNumberAndId);

router.get('/get_chats/:phone_num', getAllChatsByNumber);

router.put('/update/:phone_num/:chat_id', updateChat);

export default router;
