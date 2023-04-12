import UserModel from '../models/user.model.js';

export const checkUserExists = async (uuid) => {
  try {
    const user = await UserModel.findOne({ uuid });
    if (!user) {
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
};
