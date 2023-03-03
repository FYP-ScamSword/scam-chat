import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
  {
    chat_id: {
      type: String
    },
    total_msgs: {
      type: Number
    },
    total_retrieved: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const ChatModel = mongoose.model('ChatSchema', ChatSchema);
export default ChatModel;
