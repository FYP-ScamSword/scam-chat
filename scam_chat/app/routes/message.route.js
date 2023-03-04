import express from 'express';
import { getMsgByNumberChatIdMsgId, createMessage, updateMessage } from '../controllers/message.controller.js';
const router = express.Router();

// Retrieve a chat with phone_num and tele handle
router.get('/get_msg/:phone_num/:chat_id/:msg_id', getMsgByNumberChatIdMsgId);
router.post('/', createMessage);
router.put('/:phone_num/:chat_id/:msg_id', updateMessage);

export default router;
