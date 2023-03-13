import MessageModel from '../models/message.model.js';

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
    }
  ], function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(result);
    }
  });
};
