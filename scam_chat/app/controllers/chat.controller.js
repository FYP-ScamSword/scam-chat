import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';
import fs from 'fs';
import UserModel from '../models/tele_user.model.js';

export const findChat = async (req, res) => {
  try {
    const user = await UserModel.find({
      members: { $in: [req.params.phone_num] }
    });
    // res.status(200).json(user);

    const userDetails = user[0];
    const apiId = Number(userDetails.api_id);
    const apiHash = String(userDetails.api_hash);
    const sessionId = String(userDetails.session_id);
    const teleHandle = req.params.tele_handle;

    const session = new StringSession(sessionId);

    const client = new TelegramClient(session, apiId, apiHash, {connectionRetries: 5});

    console.log(apiId, apiHash, sessionId);
  
    
    await client.connect({onError: (err) => console.log(err)});

  
  
    const msgs = await client.getMessages(teleHandle, {
      limit: 134
    });



    // creating the strings that will be used to write to the Output.txt file
    const stringNumOfMessages = 'There exists ' + JSON.stringify(msgs.total) + ' messages\n';
    const stringNumMessagesPrinted = 'We printed ' + JSON.stringify(msgs.length) + ' messages\n';

    console.log('the total number of msgs are', msgs.total);
    console.log('what we got is ', msgs.length);

    // writing and appending the number of messages to Output.txt
    fs.writeFile('Output.txt', stringNumOfMessages, (err) => {
      if (err) throw err;
    });

    fs.appendFile('Output.txt', stringNumMessagesPrinted, (err) => {
      if (err) throw err;
    });

 
    for (const msg of msgs) {
      // console.log("msg is",msg); // this line is very verbose but helpful for debugging
      console.log("msg text is : ", msg.text);

      // creating the string for each text message
      const textMessage = msg.text + '\n';
      // appending each text message to the text file
      fs.appendFile('Output.txt', textMessage, (err) => {
        if (err) throw err;
      });
    }
    res.status(200).json(userDetails);
  } catch (error) {
    res.status(500).json(error);
  }
};
