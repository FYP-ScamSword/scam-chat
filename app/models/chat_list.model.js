import mongoose from 'mongoose';

const ChatListSchema = new mongoose.Schema(
  {
    phone_num: {
      type: String,
      required: true
    },
    chat_ids: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

const ChatListModel = mongoose.model('ChatList', ChatListSchema);
export default ChatListModel;
