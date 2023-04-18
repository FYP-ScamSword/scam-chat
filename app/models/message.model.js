import mongoose from 'mongoose';

/**
 * Represents a message sent over telegram
 */

const messageSchema = new mongoose.Schema(
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
  { timestamps: true });

messageSchema.index({ phone_num: 1, msg_id: 1 }, { unique: true });
const MessageModel = mongoose.model('Message', messageSchema);
export default MessageModel;
