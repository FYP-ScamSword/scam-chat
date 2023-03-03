import MessageModel from '../models/message.model.js';


export const getMsgByNumberChatIdMsgId = async (req, res) => {

    try {
        const msgDetails = await MessageModel.find({
          phone_num: { $in: [req.params.phone_num] },
          chat_id: { $in: [req.params.chat_id] },
          msg_id: { $in: [req.params.msg_id] }
     
        });
        res.status(200).json(msgDetails);
      } catch (error) {
        res.status(500).json(error);
      }



}