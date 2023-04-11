import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import { NewMessage } from 'telegram/events/index.js';
import UserModel from '../models/tele_user.model.js';
import MessageModel from '../models/message.model.js';
import ChatModel from '../models/chat.model.js';
import moment from 'moment-timezone';
moment().tz("Asia/Singapore").format();

/**
 * Checks if an object is empty
 * @param {*} obj
 * @returns
 */
function isEmptyObject (obj) {
  return !Object.keys(obj).length;
}

/**
 * Converts js `Date` to 12-hour format
 * @param {*} date
 * @returns
 */
function getTime (date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();

  // Check whether AM or PM
  const newformat = hours >= 12 ? 'PM' : 'AM';

  // Find current hour in AM-PM Format
  hours = hours % 12;

  // To display "0" as "12"
  hours = hours || 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + ':' + minutes + ' ' + newformat;
}

/**
 * GETs from DB (retrieve user data)
 * retrieves chat and messages from telegram API
 * checks if they exist in DB
 * POST to chat if not exists, POST to messages if not exists
 * @param {*} req
 * @param {*} res
 */
export const findChat = async (req, res) => {
  try {
    // retrieve user details from DB to login to tele
    const user = await UserModel.find({
      phone_num: req.params.phone_num
    });

    const userDetails = user[0];
    const apiId = Number(userDetails.api_id);
    const apiHash = String(userDetails.api_hash);
    const sessionId = String(userDetails.session_id);

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

    await client.connect({ onError: (err) => console.log(err) });

    const chats = await client.getDialogs('me', {});
    const me = await client.getParticipants('me', {});
    const myChatId = me[0].id;

    for (const chat of chats) {
      let msgs;
      const chatId = chat.id;

      if (chatId.equals(777000) || chatId.equals(myChatId)) {
        continue;
      } else if (chatId > 0) {
        msgs = await client.getMessages(chatId, {
          limit: 100
        });
      } else {
        continue;
      }

      // check if current chat already stored to db, by searching db by chatId
      const chatIdQuery = await ChatModel.find({
        phone_num: req.params.phone_num,
        chat_id: chatId
      });

      console.log(chatIdQuery);
      const totalMsgs = msgs.total;
      // if not stored in db yet, save into db
      if (isEmptyObject(chatIdQuery)) {
        const sender = await msgs[0].getSender();

        // const chatId = msgs[0].chatId;
        const contact = await client.getParticipants(chatId, {});
        const contactName = contact[0].firstName;
        const latestMsg = msgs[0].text;
        let type = 0;
        const time = msgs[0].date;

        if (Number(chatId) !== Number(sender.id)) {
          type = 1;
        }

        const chat = new ChatModel({
          phone_num: req.params.phone_num,
          contact_name: contactName,
          total_msgs: totalMsgs,
          chat_id: chatId,
          latest_message: latestMsg,
          type,
          time
        });
        try {
          const result = await chat.save();
          console.log(result);
        } catch (error) {

        }
      } else if (totalMsgs !== chatIdQuery[0].total_msgs) {
        console.log(chatIdQuery[0].total_msgs);
        const time = msgs[0].date;
        const latestMsg = msgs[0].text;
        const sender = await msgs[0].getSender();
        let type = 0;
        if (Number(chatId) !== Number(sender.id)) {
          type = 1;
        }

        await chatIdQuery[0].updateOne({ $set: { total_msgs: chatIdQuery[0].total_msgs, latest_message: latestMsg, type, time } });
      }

      for (const msg of msgs) {
        const sender = await msg.getSender();
        const senderUsername = await sender.username;
        const senderId = msg.senderId;
        const senderFirstName = sender.firstName;
        const text = msg.text;
        const msgId = msg.id;
        const date = new Date(msg.date * 1000);
        const formattedDate = date.toISOString().substring(0, 10);
        // const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
        const formattedTime = getTime(date);
        let type = 0;
        const chatId = msg.chatId;

        if (Number(chatId) !== Number(senderId)) {
          type = 1;
        }

        // check if current message already stored in DB by both chatId & msgId
        const messageId = await MessageModel.find({

          msg_id: { $in: [msgId] },
          chat_id: { $in: [chatId] }

        });

        console.log(messageId);
        // if not stored yet, save to db.
        if (isEmptyObject(messageId)) {
          const message = new MessageModel({
            phone_num: req.params.phone_num,
            chat_id: chatId,
            msg_id: msgId,
            sender_username: senderUsername,
            sender_id: senderId,
            sender_firstname: senderFirstName,
            text,
            type,
            date: formattedDate,
            time: formattedTime,
            epoch: msg.date
          });
          try {
            const result = await message.save();

            console.log(result);
          } catch (error) {
            // res.status(500).json(error);
          }
        }
      }
    }
  } catch (error) {
    res.status(500).json(error.toString());
  }
  // return 201 if everything gets posted
  res.status(201).json();
};

/**
 * TODO: Not fully implemented yet
 * Polling function that retrieves latest messages from telegram server
 * @param {*} req
 * @param {*} res
 */
export const getLatestChat = async (req, res) => {
  try {
    const user = await UserModel.find({
      members: { $in: [req.params.phone_num] }
    });

    const userDetails = user[0];
    const apiId = Number(userDetails.api_id);
    const apiHash = String(userDetails.api_hash);
    const sessionId = String(userDetails.session_id);
    // const teleHandle = req.params.tele_handle;

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

    await client.connect({ onError: (err) => console.log(err) });

    async function eventPrint (event) {
      const message = event.message;

      // Checks if it's a private message (from user or bot)
      if (event.isPrivate) {
        // prints sender id
        console.log(message.senderId);
        // read message
        if (message.text === 'hello') {
          const sender = await message.getSender();
          console.log('sender is', sender);
          await client.sendMessage(sender, {
            message: `hi your id is ${message.senderId}`
          });
        }
      }
    }
    // adds an event handler for new messages
    client.addEventHandler(eventPrint, new NewMessage({}));
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Get all chats of the specified canary account by phone number
 * @param {*} req
 * @param {*} res
 */
export const getAllChatsByNumber = async (req, res) => {
  try {
    const chatDetails = await ChatModel.find({
      phone_num: req.params.phone_num

    }).sort({ time: -1 });
    res.status(200).json(chatDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Get a specific chat by canary account phone number and chat ID
 * @param {*} req
 * @param {*} res
 */
export const getChatByNumberAndId = async (req, res) => {
  try {
    const chatDetails = await ChatModel.find({
      phone_num: { $in: [req.params.phone_num] },
      chat_id: { $in: [req.params.chat_id] }

    });
    res.status(200).json(chatDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Create new chat
 * @param {*} req
 * @param {*} res
 */
export const createChat = async (req, res) => {
  const chat = new ChatModel({
    phone_num: req.body.phone_num,
    contact_name: req.body.contact_name,
    total_msgs: req.body.total_msgs,
    chat_id: req.body.chat_id,
    latest_message: req.body.latest_message,
    type: req.body.type,
    time: req.body.time
  });
  try {
    const result = await chat.save();
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Update chat when `total_msgs` is incremented
 * @param {*} req
 * @param {*} res
 */
export const updateChat = async (req, res) => {
  try {
    const chatDetails = await ChatModel.findOne({
      phone_num: { $in: [req.params.phone_num] },
      chat_id: { $in: [req.params.chat_id] }
    });
    // console.log(chatDetails);
    await chatDetails.updateOne({ $set: { latest_message: req.body.text }, $inc: { total_msgs: 1 } });
    res.status(200).json('Chat updated!');
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Refresh / Update Single Chat from Telegram
 * @param {*} req
 * @param {*} res
 */
export const refreshSingleChat = async (req, res) => {
  try {
    const user = await UserModel.find({
      phone_num: req.params.phone_num
    });

    const userDetails = user[0];
    const apiId = Number(userDetails.api_id);
    const apiHash = String(userDetails.api_hash);
    const sessionId = String(userDetails.session_id);

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

    await client.connect({ onError: (err) => console.log(err) });

    await client.getDialogs('me', {});

    // single chat id
    const chatId = req.params.chat_id;

    const msgs = await client.getMessages(Number(chatId), {
      limit: 100
    });

    // check if current chat already stored to db, by searching db by chatId
    const chatIdQuery = await ChatModel.find({
      phone_num: req.params.phone_num,
      chat_id: chatId
    });

    console.log(chatIdQuery);
    const totalMsgs = msgs.total;
    // if not stored in db yet, save into db
    if (isEmptyObject(chatIdQuery)) {
      const sender = await msgs[0].getSender();

      // const chatId = msgs[0].chatId;
      const contact = await client.getParticipants(chatId, {});
      const contactName = contact[0].firstName;
      const latestMsg = msgs[0].text;
      let type = 0;
      const time = msgs[0].date;

      if (Number(chatId) !== Number(sender.id)) {
        type = 1;
      }

      const chat = new ChatModel({
        phone_num: req.params.phone_num,
        contact_name: contactName,
        total_msgs: totalMsgs,
        chat_id: chatId,
        latest_message: latestMsg,
        type,
        time
      });
      try {
        const result = await chat.save();
        console.log(result);
      } catch (error) {

      }
    } else if (totalMsgs !== chatIdQuery[0].total_msgs) {
      console.log(chatIdQuery[0].total_msgs);
      const time = msgs[0].date;
      const latestMsg = msgs[0].text;
      const sender = await msgs[0].getSender();
      let type = 0;
      if (Number(chatId) !== Number(sender.id)) {
        type = 1;
      }

      await chatIdQuery[0].updateOne({ $set: { total_msgs: chatIdQuery[0].total_msgs, latest_message: latestMsg, type, time } });
    }

    for (const msg of msgs) {
      const sender = await msg.getSender();
      const senderUsername = await sender.username;
      const senderId = msg.senderId;
      const senderFirstName = sender.firstName;
      const text = msg.text;
      const msgId = msg.id;
      const date = new Date(msg.date * 1000);
      const formattedDate = date.toISOString().substring(0, 10);
      // const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
      const formattedTime = getTime(date);
      let type = 0;
      const chatId = msg.chatId;

      if (Number(chatId) !== Number(senderId)) {
        type = 1;
      }

      // check if current message already stored in DB by both chatId & msgId
      const messageId = await MessageModel.find({

        msg_id: { $in: [msgId] },
        chat_id: { $in: [chatId] }

      });

      console.log(messageId);
      // if not stored yet, save to db.
      if (isEmptyObject(messageId)) {
        const message = new MessageModel({
          phone_num: req.params.phone_num,
          chat_id: chatId,
          msg_id: msgId,
          sender_username: senderUsername,
          sender_id: senderId,
          sender_firstname: senderFirstName,
          text,
          type,
          date: formattedDate,
          time: formattedTime,
          epoch: msg.date
        });

        const result = await message.save();

        console.log(result);
      }
    }

    res.status(200).json('Chat updated!');
  } catch (error) {
    res.status(500).json(error);
  }
};
