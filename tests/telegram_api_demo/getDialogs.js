/*
    Getting Telegram Chats By Telegram Handle

    - Prints total number of messages that exist between the user and the account logged in
    - Prints the number of messages that will be printed as well.
        [important because]
        - We can limit to print only the top N  (e.g. top 10) most recent messages for better performance
        - then the total number of messages and total number printed will be different

    Top of the file displays most recent chat
    Bottom displays oldest chat
*/

const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const fs = require('fs');

const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

/*
   Environment files returns strings
   Only apiId has to be a number

   Other methods to change string into number:

   BITWISE OR
   const apiId = process.env.API_ID | 0;

   Unary Plus Operator
   const apiId = +process.env.API_ID;

   parseInt function
   const apiId = parseInt(process.env.API_ID);
*/
const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const sessionId = process.env.SESSION_ID;

/* without string session, one would have to verify by logging in to telegram / getting telegram OTP everytime the code runs */
const session = new StringSession(sessionId); // You should put your string session here

(
  async () => {
    const client = new TelegramClient(session, apiId, apiHash, {});
    await client.connect();

    // retrieving the messages by Telegram handle (placed in .env file)
    const chats = await client.getDialogs('me', {});

    // creating the strings that will be used to write to the Output.txt file
    const stringNumOfChats = 'There exists ' + JSON.stringify(chats.total) + ' chats\n';

    // writing and appending the number of chats to Output.txt
    fs.writeFile('Output.txt', stringNumOfChats, (err) => {
      if (err) throw err;
    });

    for (const chat of chats) {
      const chatId = chat.id;
      let outputText = '';

      if (chatId > 0) {
        const contact = await client.getParticipants(chatId, {});
        const contactName = contact[0].firstName;
        outputText = chatId + ': ' + contactName + '\n';
      } else {
        outputText = chatId + '\n';
      }

      // appending each text chat to the text file
      fs.appendFile('Output.txt', outputText, (err) => {
        if (err) throw err;
      });
    }
  })();
