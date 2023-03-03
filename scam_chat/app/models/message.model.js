import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
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
    text: {
      type: String
    },
    date: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const MessageModel = mongoose.model('Message', MessageSchema);
export default MessageModel;
