import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import fs from 'fs/promises';
import { NewMessage } from 'telegram/events/index.js';
import UserModel from '../models/tele_user.model.js';
import MessageModel from '../models/message.model.js';
import ChatModel from '../models/chat.model.js';

// function to check if an object is empty (i.e. empty array)
function isEmptyObject (obj) {
  return !Object.keys(obj).length;
}
// GETs from DB (retrieve user data)
// retrieves chat and messages from telegram API
// checks if they exist in DB
// POST to chat if not exists, POST to messages if not exists
export const findChat = async (req, res) => {

  function getTime(date) {
   
    var hours = date.getHours();
    var minutes = date.getMinutes();
      
    // Check whether AM or PM
    var newformat = hours >= 12 ? 'PM' : 'AM';
      
    // Find current hour in AM-PM Format
    hours = hours % 12;
      
    // To display "0" as "12"
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
      
    return hours + ':' + minutes + ' ' + newformat;
  }

  try {
    // retrieve user details from DB to login to tele
    const user = await UserModel.find({
      members: { $in: [req.params.phone_num] }
    });

    const userDetails = user[0];
    const apiId = Number(userDetails.api_id);
    const apiHash = String(userDetails.api_hash);
    const sessionId = String(userDetails.session_id);
    const teleHandle = req.params.tele_handle;

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

    await client.connect({ onError: (err) => console.log(err) });

    const msgs = await client.getMessages(teleHandle, {
      limit: 100
    });

    // creating the strings that will be used to write to the Output.txt file
    const stringNumOfMessages = 'There exists ' + JSON.stringify(msgs.total) + ' messages\n';
    const stringNumMessagesPrinted = 'We printed ' + JSON.stringify(msgs.length) + ' messages\n';

    console.log('the total number of msgs are', msgs.total);
    console.log('what we got is ', msgs.length);

    // writing and appending the number of messages to Output.txt
    await fs.writeFile('Output.txt', stringNumOfMessages, (err) => {
      if (err) { throw err; }
    });

    await fs.appendFile('Output.txt', stringNumMessagesPrinted, (err) => {
      if (err) { throw err; }
    });

    const chatId = msgs[0].chatId;
    // check if current chat already stored to db, by searching db by chatId
    const chatIds = await ChatModel.find({
      chat_id: { $in: [chatId] }
    });
    // if not stored in db yet, save into db
    if (isEmptyObject(chatIds)) {
      const totalMsgs = msgs.total;
      const sender = await msgs[0].getSender();
      const contactName = sender.firstName;

      const chat = new ChatModel({
        phone_num: req.params.phone_num,
        contact_name: contactName,
        total_msgs: totalMsgs,
        chat_id: chatId
      });
      try {
        const result = await chat.save();
        console.log(result);
      } catch (error) {

      }
    }

    for (const msg of msgs) {
      // console.log('msg is',msg); // this line is very verbose but helpful for debugging
      console.log('msg text is : ', msg.text);

      // creating the string for each text message
      const textMessage = msg.sender.username + ': ' + msg.rawText + ' [' + new Date(msg.date * 1000) + '] ' + msg.id + ' \n';
      // appending each text message to the text file
    

      const sender = await msg.getSender();
      const senderUsername = await sender.username;
      const senderId = msg.senderId;
      const senderFirstName = sender.firstName;
      const text = msg.text;
      const msgId = msg.id;
      const date = new Date(msg.date * 1000);
      const formattedDate = date.getUTCDate() + '/' + (date.getUTCMonth() + 1)+ '/' + date.getUTCFullYear()
      const formattedTime = getTime(date)
      var type = 0;
      const chatId = msg.chatId;

      if (Number(chatId) != Number(senderId)) {
        type = 1;
      }

      console.log(type);
   

      console.log(msgId);
      // check if current message already stored in DB by both chatId & msgId
      const messageId = await MessageModel.find({

        msg_id: { $in: [msgId] },
        chat_id: { $in: [chatId] }

      });

      console.log(messageId);
      // if not stored yet, save to db.
      if (isEmptyObject(messageId)) {
        const message = new MessageModel({
          phone_num: req.params.phone_num,
          chat_id: chatId,
          msg_id: msgId,
          sender_username: senderUsername,
          sender_id: senderId,
          sender_firstname: senderFirstName,
          text,
          type,
          date: formattedDate,
          time: formattedTime
        });
        try {
          const result = await message.save();

          console.log(result);
        } catch (error) {
          // res.status(500).json(error);
        }
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
  // return 200 if everything gets posted
  res.status(200).json();
};

// work in progress -- not functional yet
// meant to listen to telegram server to get live updates for new messages
export const getLatestChat = async (req, res) => {
  try {
    const user = await UserModel.find({
      members: { $in: [req.params.phone_num] }
    });

    const userDetails = user[0];
    const apiId = Number(userDetails.api_id);
    const apiHash = String(userDetails.api_hash);
    const sessionId = String(userDetails.session_id);
    // const teleHandle = req.params.tele_handle;

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });

    await client.connect({ onError: (err) => console.log(err) });

    async function eventPrint (event) {
      const message = event.message;

      // Checks if it's a private message (from user or bot)
      if (event.isPrivate) {
        // prints sender id
        console.log(message.senderId);
        // read message
        if (message.text === 'hello') {
          const sender = await message.getSender();
          console.log('sender is', sender);
          await client.sendMessage(sender, {
            message: `hi your id is ${message.senderId}`
          });
        }
      }
    }
    // adds an event handler for new messages
    client.addEventHandler(eventPrint, new NewMessage({}));
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllChatsByNumber = async (req, res) => {
  try {
    const chatDetails = await ChatModel.find({
      phone_num: { $in: [req.params.phone_num] }
 
    });
    res.status(200).json(chatDetails);
  } catch (error) {
    res.status(500).json(error);
  }


}

export const getChatByNumberAndId = async (req, res) => {
  try {
    const chatDetails = await ChatModel.find({
      phone_num: { $in: [req.params.phone_num] },
      chat_id: { $in: [req.params.chat_id] }
 
    });
    res.status(200).json(chatDetails);
  } catch (error) {
    res.status(500).json(error);
  }

}
