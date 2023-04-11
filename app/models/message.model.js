import mongoose from 'mongoose';

/**
 * Represents a message sent over telegram
 */
const MessageModel = mongoose.model('Message',
  new mongoose.Schema(
    {
      phone_num: {
        type: String,
        required: true
      },
      chat_id: String,
      msg_id: String,
      sender_username: String,
      sender_id: String,
      sender_firstname: String,
      text: String,
      type: Number,
      date: String,
      time: String,
      epoch: Number
    },
    { timestamps: true }));

export default MessageModel;
