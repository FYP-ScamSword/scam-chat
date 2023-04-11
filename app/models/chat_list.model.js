import mongoose from 'mongoose';

/**
 * Represents a list of available chats for a given canary account (identified
 * by `phone_num`)
 */
const ChatListModel = mongoose.model('ChatList',
  new mongoose.Schema(
    {
      phone_num: {
        type: String,
        required: true
      },
      chat_ids: {
        type: Array
      }
    },
    { timestamps: true }));

export default ChatListModel;
