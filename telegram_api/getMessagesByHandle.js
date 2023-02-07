/*
    Getting Telegram Messages By Telegram Handle

    - Prints total number of messages that exist between the user and the account logged in
    - Prints the number of messages that will be printed as well.
        [important because]
        - We can limit to print only the top N  (e.g. top 10) most recent messages for better performance
        - then the total number of messages and total number printed will be different

    Top of the file displays most recent message
    Bottom displays oldest message
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
const teleHandle = process.env.TELE_HANDLE;

/* without string session, one would have to verify by logging in to telegram / getting telegram OTP everytime the code runs */
const session = new StringSession(sessionId); // You should put your string session here

(
  async () => {
    const client = new TelegramClient(session, apiId, apiHash, {});
    await client.connect();

    // retrieving the messages by Telegram handle (placed in .env file)
    const msgs = await client.getMessages(teleHandle, {
      limit: 134
    });

    // creating the strings that will be used to write to the Output.txt file
    const stringNumOfMessages = 'There exists ' + JSON.stringify(msgs.total) + ' messages\n';
    const stringNumMessagesPrinted = 'We printed ' + JSON.stringify(msgs.length) + ' messages\n';

    // writing and appending the number of messages to Output.txt
    fs.writeFile('Output.txt', stringNumOfMessages, (err) => {
      if (err) throw err;
    });

    fs.appendFile('Output.txt', stringNumMessagesPrinted, (err) => {
      if (err) throw err;
    });

    // console.log("the total number of msgs are", msgs.total);
    // console.log("what we got is ", msgs.length);
    for (const msg of msgs) {
      // console.log("msg is",msg); // this line is very verbose but helpful for debugging
      // console.log("msg text is : ", msg.text);

      // creating the string for each text message
      const textMessage = msg.text + '\n';
      // appending each text message to the text file
      fs.appendFile('Output.txt', textMessage, (err) => {
        if (err) throw err;
      });
    }
  })();
