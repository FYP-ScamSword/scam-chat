import ChatListModel from '../models/chat_list.model.js';
import CanaryAccountModel from '../models/canary_account.model.js';
import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import moment from 'moment-timezone';
moment().tz('Asia/Singapore').format();

/**
 * Get list of chats
 * @param {*} req
 * @param {*} res
 */
export const listChat = async (req, res) => {
  try {
    const chatListDetails = await ChatListModel.find({
      phone_num: { $in: [req.params.phone_num] }
    });
    res.status(200).json(chatListDetails);
  } catch (error) {
    res.status(500).json(error.toString());
  }
};

/**
 * POST list of chats
 * @param {*} req
 * @param {*} res
 */
export const createChatList = async (req, res) => {
  try {
    const canaryAcc = await CanaryAccountModel.find({
      phone_num: req.params.phone_num
    });

    const canaryAccDetails = canaryAcc[0];
    const apiId = Number(canaryAccDetails.api_id);
    const apiHash = String(canaryAccDetails.api_hash);
    const sessionId = String(canaryAccDetails.session_id);

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

    await client.connect({ onError: (err) => console.log(err) });

    const chats = await client.getDialogs('me', {});
    const me = await client.getParticipants('me', {});
    const myChatId = me[0].id;

    const chatList = [];

    for (const chat of chats) {
      const chatId = chat.id;

      if (chatId.equals(777000) || chatId.equals(myChatId)) {
        continue;
      } else if (chatId > 0) {
        chatList.push(chatId);
      } else {
        continue;
      }
    }

    const chatListDetails = new ChatListModel({
      phone_num: req.params.phone_num,
      chat_ids: chatList
    });

    const result = await chatListDetails.save();
    console.log(result);

    res.status(201).json('Chat List Added');
  } catch (error) {
    res.status(500).json(error.toString());
  }
};

/**
 * PUT / Update list of chats
 * @param {*} req
 * @param {*} res
 */
export const updateChatList = async (req, res) => {
  try {
    const canaryAcc = await CanaryAccountModel.find({
      phone_num: req.params.phone_num
    });

    const canaryAccDetails = canaryAcc[0];
    const apiId = Number(canaryAccDetails.api_id);
    const apiHash = String(canaryAccDetails.api_hash);
    const sessionId = String(canaryAccDetails.session_id);

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

    await client.connect({ onError: (err) => console.log(err) });

    const chats = await client.getDialogs('me', {});
    const me = await client.getParticipants('me', {});
    const myChatId = me[0].id;

    const chatList = [];

    for (const chat of chats) {
      const chatId = chat.id;

      if (chatId.equals(777000) || chatId.equals(myChatId)) {
        continue;
      } else if (chatId > 0) {
        chatList.push(chatId);
      } else {
        continue;
      }
    }

    const chatListDetails = await ChatListModel.findOne({
      phone_num: { $in: [req.params.phone_num] }
    });

    chatListDetails.updateOne({ $set: { chat_ids: chatList } });
    res.status(200).json(chatListDetails);
  } catch (error) {
    res.status(500).json(error.toString());
  }
};
