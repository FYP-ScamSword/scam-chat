const { Api, TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const dotenv = require("dotenv");

dotenv.config({path: "./.env"});

const apiIdString = process.env.API_ID;
const apiId = Number(apiIdString);
const apiHash = process.env.API_HASH;
const sessionId = process.env.SESSION_ID;
const session = new StringSession(sessionId); // You should put your string session here
const client = new TelegramClient(session, apiId, apiHash, {});

(async function run() {
  await client.connect(); // This assumes you have already authenticated with .start()

  const result = await client.invoke(
    new Api.messages.GetAllChats({
      exceptIds: [],
    })
  );
  console.log(result.chats); // prints the result
})();