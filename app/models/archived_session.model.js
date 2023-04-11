import mongoose from 'mongoose';

/**
 * Represents an archived chat session between a canary account and a telegram
 * user.
 */
const ArchivedSessionModel = mongoose.model('Archived_session',
  new mongoose.Schema(
    {
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
      }
    }));

export default ArchivedSessionModel;
