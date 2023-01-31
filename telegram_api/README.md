# Telegram API


## Instructions:
1. Create a `.env` file in the same folder
2. Go to `https://my.telegram.org/apps` and retrieve API_ID and API_HASH of your Telegram account.
3. Paste the code snippet below in the `.env` file, and fill up the API_ID and API_HASH. It is okay to leave SESSION_ID blank for now. 

`.env`
```
API_ID = ""
API_HASH = ""
SESSION_ID = ""
```

## Pre-Installation:
1. Have NodeJS installed (Currently using v16.15.0)
2. `npm install dotenv telegram input`


## Sequence
Run `node login.js` first. You will be required to login to your telegram account with your phone number and password.
If you did not set a password, you will be sent an OTP message in your Telegram account.
After successfully logging in, the `SESSION_ID` will be printed on the console. 
Copy this `SESSION_ID` and paste into the `.env` file.
A "Hello!" message will also be sent to your Telegram account's Saved Messages.
