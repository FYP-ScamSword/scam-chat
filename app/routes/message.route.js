import express from 'express';
import { getMsgByNumberChatIdMsgId, createMessage, updateMessage, getMessagesByChatId, sendTele } from '../controllers/message.controller.js';
const router = express.Router();

router.get('/get_msg/:phone_num/:chat_id/:msg_id', getMsgByNumberChatIdMsgId);
router.get('/bychatID/:phone_num/:chat_id', getMessagesByChatId);

router.post('/createMessage', createMessage);
router.post('/sendTele', sendTele);

router.put('/:phone_num/:chat_id/:msg_id', updateMessage);

export default router;
