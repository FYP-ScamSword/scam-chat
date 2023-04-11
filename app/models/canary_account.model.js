import mongoose from 'mongoose';

/**
 * Represents a canary account used to chat with scammers on telegram
 */
const CanaryAccountModel = mongoose.model('Canary_account',
  new mongoose.Schema(
    {
      phone_num: {
        type: String,
        unique: true,
        required: true
      },
      api_id: {
        type: Number,
        required: true
      },
      api_hash: {
        type: String,
        required: true
      },
      session_id: {
        type: String,
        required: true
      },
      alias: {
        type: String,
        required: true
      }

    },
    { timestamps: true }));

export default CanaryAccountModel;
