import MessageModel from '../models/message.model.js';
import CanaryAccountModel from '../models/canary_account.model.js';
import ChatModel from '../models/chat.model.js';
import moment from 'moment-timezone';
import { getClient } from '../utils/client_pool.util.js';
moment().tz('Asia/Singapore').format();

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
 * Retrieves a message uniquely identified by `phone_num`, `chat_id` and `msq_id`
 * @param {*} req
 * @param {*} res
 */
export const getMsgByNumberChatIdMsgId = async (req, res) => {
  try {
    const msgDetails = await MessageModel.find({
      phone_num: { $in: [req.params.phone_num] },
      chat_id: { $in: [req.params.chat_id] },
      msg_id: { $in: [req.params.msg_id] }

    });
    res.status(200).json(msgDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Send a new telegram message
 * @param {*} req
 * @param {*} res
 */
export const createMessage = async (req, res) => {
  const message = new MessageModel({
    phone_num: req.body.phone_num,
    chat_id: req.body.chat_id,
    msg_id: req.body.msg_id,
    sender_username: req.body.sender_username,
    sender_id: req.body.sender_id,
    sender_firstname: req.body.sender_firstname,
    text: req.body.text,
    type: req.body.type,
    date: req.body.date,
    time: req.body.time,
    epoch: req.body.epoch
  });

  try {
    const result = await message.save();
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};

/**
 * Edit an existing message
 * @param {*} req
 * @param {*} res
 */
export const updateMessage = async (req, res) => {
  try {
    const msgDetails = await MessageModel.findOne({
      phone_num: { $in: [req.params.phone_num] },
      chat_id: { $in: [req.params.chat_id] },
      msg_id: { $in: [req.params.msg_id] }

    });
    console.log(msgDetails);
    await msgDetails.updateOne({ $set: req.body });
    res.status(200).json('Message updated!');
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Get all messages from a conversation between a canary account identified by `phone_num`,
 * and external user identified by `chat_id`
 * @param {*} req
 * @param {*} res
 */
export const getMessagesByChatId = async (req, res) => {
  MessageModel.aggregate([
    {
      $match: {
        phone_num: req.params.phone_num,
        chat_id: req.params.chat_id
      }
    },
    {
      $group: {
        _id: { phone_num: '$phone_num', chat_id: '$chat_id', date: '$date' },
        users: {
          $addToSet: { firstname: '$sender_firstname', type: '$type' }
        },
        messages: { $push: { msg_id: '$msg_id', text: '$text', type: '$type', time: '$time' } }
      }
    },
    {
      $project: {
        _id: 0,
        phone_num: '$_id.phone_num',
        chat_id: '$_id.chat_id',
        users: '$users',
        date: '$_id.date',
        messages: { $reverseArray: '$messages' }
      }
    },
    { $sort: { date: 1 } }
  ], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(result);
    }
  });
};

/**
 * Post message to both telegram and our database chat.
 * @param {*} req
 * @param {*} res
 */
export const sendTele = async (req, res) => {
  try {
    // update chat API
    const chatDetails = await ChatModel.findOne({
      phone_num: { $in: [req.body.phone_num] },
      chat_id: { $in: [req.body.chat_id] }
    });
    console.log(chatDetails);
    await chatDetails.updateOne({ $set: { latest_message: req.body.text }, $inc: { total_msgs: 1 } });

    // get tele_user API
    const canaryAcc = await CanaryAccountModel.find({
      phone_num: req.body.phone_num
    });
    console.log(canaryAcc);
    // configuring user details to connect to telegram API
    const canaryAccDetails = canaryAcc[0];
    const apiId = Number(canaryAccDetails.api_id);
    const apiHash = String(canaryAccDetails.api_hash);
    const sessionId = String(canaryAccDetails.session_id);

    const client = await getClient(sessionId, apiId, apiHash);

    // send to telegram
    await client.connect({ onError: (err) => console.log(err) });
    await client.getDialogs('me', {});
    const chatId = req.body.chat_id;
    const msg = await client.sendMessage(chatId, { message: req.body.text });
    console.log(msg);
    // pull last message from tele and post to DB
    const contact = await client.getParticipants('me', {});

    const myContact = contact[0];

    const senderUsername = myContact.username;
    const senderId = myContact.id;
    const senderFirstName = myContact.firstName;
    const text = msg.text;
    const msgId = msg.id;
    const date = new Date(msg.date * 1000);
    const formattedDate = date.toISOString().substring(0, 10);
    const formattedTime = getTime(date);
    const type = 1;

    // client.disconnect();
    const message = new MessageModel({
      phone_num: req.body.phone_num,
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
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error.toString());
  }
};
