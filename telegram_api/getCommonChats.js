// gets the common chats / groups you are in with the user - can be useful to see where/which telegram group the scammer found you from
// however, cannot work if you don't know their telegram handle ..

// as good as the UI part 'Groups in common'

const { Api, TelegramClient } = require('telegram');
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

(async function run() {
  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(
    new Api.messages.GetCommonChats({
      userId: '', //tele handle
      maxId: 0,
      limit: 100,
    })
  );
  console.log(result); // prints the result
})();