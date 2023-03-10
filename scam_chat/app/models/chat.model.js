import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    phone_num: {
      type: String,
      required: true
    },
    chat_id: {
      type: String
    },
    contact_name: {
      type: String
    },
    total_msgs: {
      type: Number
    },
    latest_message: {
      type: String
    },
    type: {
      type: Number
    },
    time: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const ChatModel = mongoose.model('Chat', ChatSchema);
export default ChatModel;
