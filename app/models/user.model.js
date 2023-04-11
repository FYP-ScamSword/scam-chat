import mongoose from 'mongoose';

const CanaryAccModel = mongoose.model('Canary_account',
  new mongoose.Schema(
    {
      phone_num: {
        type: String,
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

export default CanaryAccModel;
