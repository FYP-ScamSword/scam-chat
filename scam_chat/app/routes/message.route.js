import express from 'express';
import { getMsgByNumberChatIdMsgId } from '../controllers/message.controller.js';
const router = express.Router();

// Retrieve a chat with phone_num and tele handle
router.get('/get_msg/:phone_num/:chat_id/:msg_id', getMsgByNumberChatIdMsgId);

export default router;
