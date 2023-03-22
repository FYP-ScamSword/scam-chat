import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
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
  { timestamps: true }
);

const UserModel = mongoose.model('Users', UserSchema);
export default UserModel;
