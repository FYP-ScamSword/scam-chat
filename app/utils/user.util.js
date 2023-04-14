import UserModel from '../models/user.model.js';

export const checkUserExists = async (username) => {
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
