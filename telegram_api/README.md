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
2. `npm install dotenv telegram input fs`


## Sequence
1. Run `node login.js` first. 
2. You will be required to login to your telegram account with your phone number.
3. An OTP message in your Telegram account. Enter the OTP provided by your account.
4. (If you have set a password) Enter your password.
5. After successfully logging in, the `SESSION_ID` will be printed on the console. A "Hello!" message will also be sent to your Telegram account's Saved Messages.
6. Copy this `SESSION_ID` and paste into the `.env` file.

You will not need to run step 1 to 6 subsequently once you have retrieved your `SESSION_ID`.
