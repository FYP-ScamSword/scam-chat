import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {

    phone_num: {
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
  }
);

const MessageModel = mongoose.model('Message', MessageSchema);
export default MessageModel;
