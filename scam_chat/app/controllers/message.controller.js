import MessageModel from '../models/message.model.js';

// get message by canary account's phone number, chatID and message ID
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

// post new message
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
    time: req.body.time
  });

  try {
    const result = await message.save();
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

// update message
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
