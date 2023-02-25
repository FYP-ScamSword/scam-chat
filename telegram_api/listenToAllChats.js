const { TelegramClient } = require('telegram');
const { NewMessage } = require('telegram/events');
const { StringSession } = require('telegram/sessions');
// const fs = require('fs');

const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;
const sessionId = process.env.SESSION_ID;

/* without string session, one would have to verify by logging in to telegram / getting telegram OTP everytime the code runs */
const session = new StringSession(sessionId); // You should put your string session here
const client = new TelegramClient(session, apiId, apiHash, {});

async function eventPrint (event) {
  const message = event.message;

  // Checks if it's a private message (from user or bot)
  if (event.isPrivate){
  
    const sender = await message.getSender();
    // log data of message
    console.log(sender.firstName + ': ' + message.text + ' [' + new Date(message.date * 1000) + ']\n');

    const msgs = await client.getMessages(sender.id, {
      limit: 1
    });
    
    // if the chat only has 1 message i.e. first message received from scammer
    if(msgs.total === 1) {
      await client.sendMessage(sender,{
        message:`i would like to know more!`
      });

      console.log("replied to above message \n")
    }
    
  }
}

(async function run () {
  await client.connect(); // This assumes you have already authenticated with .start()

  await client.getMe();
  // adds an event handler for new messages
  client.addEventHandler(eventPrint, new NewMessage({}));
})();
