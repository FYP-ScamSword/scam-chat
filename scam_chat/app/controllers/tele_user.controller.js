import UserModel from '../models/tele_user.model.js';

/**
 * Create new canary account (user)
 * @param {*} req
 * @param {*} res
 */
export const createUser = async (req, res) => {
  const newUser = new UserModel({
    phone_num: req.body.phone_num,
    api_id: req.body.api_id,
    api_hash: req.body.api_hash,
    session_id: req.body.session_id

  });
  try {
    const result = await newUser.save();
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Get all stored users
 * @param {*} req
 * @param {*} res
 */
export const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find({ });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

/**
 * Get user by `phone_num`
 * @param {*} req
 * @param {*} res
 */
export const getUserByNum = async (req, res) => {
  try {
    const user = await UserModel.find({
      phone_num: req.params.phone_num
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};
