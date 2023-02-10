import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
  {
    phone_num: {
      type: String,
      required: true,
    },
    api_id: {
      type: Number,
      required: true,
    },
    api_hash: {
      type: String,
      required: true,
    },
    session_id: {
        type: String,
        required: true,
      }
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", UserSchema);
export default UserModel;