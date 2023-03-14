const { TelegramClient } = require('telegram');
const { StringSession } = require('telegram/sessions');
const input = require('input'); // npm i input
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

/*
   Environment files return strings
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
const session = new StringSession(sessionId);// You should put your string session here

(async () => {
  console.log('Loading interactive example...');
  const client = new TelegramClient(session, apiId, apiHash, {
    connectionRetries: 5
  });
  await client.start({
    phoneNumber: async () => await input.text('Please enter your number: '),
    password: async () => await input.text('Please enter your password: '),
    phoneCode: async () =>
      await input.text('Please enter the code you received: '),
    onError: (err) => console.log(err)
  });
  console.log('You should now be connected.');

  /* prints out the sessionID */
  console.log(client.session.save()); // Save this string in SESSION_ID of the .env file to avoid logging in again

  // this sends 'Hello!' to my saved messages
  await client.sendMessage('me', { message: 'Hello!' });
})();
