const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');

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
const client = new TelegramClient(session, apiId, apiHash, {});
const teleHandle = process.env.TELE_HANDLE;

(async function run () {
  await client.connect(); // This assumes you have already authenticated with .start()

  // send a message to telegram handle
  await client.sendMessage(teleHandle, { message: 'Hello!' });

  // ...but here I want markdown
  await client.sendMessage(teleHandle, { message: 'Hello, **NAME**!!! \n\nfrom me~' }, { parseMode: 'md' });

  // ...and here I need HTML
  // await client.sendMessage('me', {message:'Hello, <i>world</i>!'}, {parseMode:'HTML'})
})();
