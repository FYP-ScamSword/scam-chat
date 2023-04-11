import mongoose from 'mongoose';

/**
 * Representa a single chat between a canary account (identified by `phone_num`)
 * and a telegram user (identified by `chat_id`)
 */
const ChatModel = mongoose.model('Chat',
  new mongoose.Schema(
    {
      phone_num: {
        type: String,
        required: true
      },
      chat_id: String,
      contact_name: String,
      total_msgs: Number,
      latest_message: String,
      type: Number,
      time: Number
    },
    { timestamps: true }));

export default ChatModel;
