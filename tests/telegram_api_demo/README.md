# Telegram API

A simple demo of how to read and write messages to Telegram using GramJS.

## Prerequisites

1. Install dependencies with `npm install`
2. Create a `.env` file in the same folder
3. Go to <https://my.telegram.org/apps> and retrieve API_ID and API_HASH of the telegram account you would like to use.
4. Paste the code snippet below in the `.env` file, and fill up the API_ID and API_HASH. SESSION_ID can be left blank for the time being.

```
API_ID=""
API_HASH=""
SESSION_ID=""
```

## Usage

1. Run `node login.js` first.
2. You will be required to login to your telegram account with your phone number.
3. An OTP message in your Telegram account. Enter the OTP provided by your account.
4. (If you have set a password) Enter your password.
5. After successfully logging in, the `SESSION_ID` will be printed on the console. A "Hello!" message will also be sent to your Telegram account's Saved Messages.
6. Copy this `SESSION_ID` and paste into the `.env` file.

You will not need to run step 1 to 6 subsequently once you have retrieved your `SESSION_ID`.
