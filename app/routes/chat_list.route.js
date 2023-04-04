import express from 'express';
import { listChat, createChatList, updateChatList } from '../controllers/chat_list.controller.js';
const router = express.Router();

router.post('/:phone_num', createChatList);

router.get('/:phone_num', listChat);

router.put('/:phone_num', updateChatList);

export default router;
