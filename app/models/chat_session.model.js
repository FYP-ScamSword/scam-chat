import mongoose from 'mongoose';

const ChatSessionSchema = new mongoose.Schema({
    uinfin: {
      type: String,
      required: true
    },
    chat_id: {
      type: String
    },
    msg_id: {
      type: String
    },
    sender_username: {
      type: String
    },
    sender_id: {
      type: String
    },
    sender_firstname: {
      type: String
    },
    text: {
      type: String
    },
    type: {
      type: Number
    },
    date: {
      type: String
    },
    time: {
      type: String
    },
    epoch: {
      type: Number
    }
  },
  {
    timestamps: true
  });

const MessageModel = mongoose.model('ChatSession', ChatSessionSchema);
export default MessageModel;
