import MessageModel from '../models/message.model.js';

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

export const createMessage = async (req, res) => {
  const message = new MessageModel({
    phone_num: req.params.phone_num,
    chat_id: req.paramschatId,
    msg_id: req.paramsmsgId,
    sender_username: req.params.sender_username,
    sender_id: req.params.sender_id,
    sender_firstname: req.params.sender_firstname,
    text: req.params.text,
    type: req.params.type,
    date: req.params.date,
    time: req.params.time
  });

  try {
    const result = await message.save();
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
