import mongoose from 'mongoose';

/**
 * Represents an active chat session between a canary account and a telegram
 * user. Optionally assigned to an authenticated user on the scam-chat app.
 */
const ActiveSessionModel = mongoose.model('Active_session',
  new mongoose.Schema(
    {
      user_id: String,
      phone_num: {
        type: String,
        required: true
      },
      chat_id: {
        type: String,
        required: true
      },
      last_sync: {
        type: Date,
        required: true
      },
      awaiting_scammer: {
        Boolean,
        required: true
      }
    }));

export default ActiveSessionModel;
