import express from 'express';
import { findChat } from '../controllers/chat.controller.js';
const router = express.Router();


// Retrieve a chat with phone_num and tele handle
router.get("/:phone_num/:tele_handle", findChat);

export default router;