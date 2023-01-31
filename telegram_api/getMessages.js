const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const fs = require('fs');

const dotenv = require("dotenv");

dotenv.config({path: "./.env"});


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

    new Api.messages.GetMessages({
      id: [0]
    })
    
  );

  fs.writeFile('Output.txt', JSON.stringify(result), (err) => {
    if (err) throw err;
  })
  console.log(result); // prints the result


  for (let i = 1; i < 100; i++) {
    const result = await client.invoke(

      new Api.messages.GetMessages({
        id: [i]
      })
      
    );
    const data = JSON.stringify(result) + "\n";
    fs.appendFile('Output.txt', data, (err) => {
      if (err) throw err;
    })
    console.log(result); // prints the result
  }
  

  // const messages = new Array<Api.Message>(1000);
  // for await (const message of client.iterMessages("me")) {
  //   messages.push(message);
  // } 

  // console.log(messages);
  
})();