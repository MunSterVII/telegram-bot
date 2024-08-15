require('dotenv').config();
const input = require("input"); // npm i input
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

const SessionFileHandler = require('./SessionFileHandler.js');

const sessionFile = new SessionFileHandler('session');

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;

(async () => {
  const sessionSave = await sessionFile.read();
  const stringSession = new StringSession(sessionSave || ""); // fill this later with the value from session.save()

  console.log("Loading interactive example...");

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You should now be connected.");

  await sessionFile.write(client.session.save()); // Save this string to avoid logging in again


  const username = process.env.CHAT_USERNAME;
  
  try {
    const user = await client.getEntity(username);
    console.log('Chat ID:', user.id);

    await client.sendMessage(user, { message: process.env.MESSAGE_COMMAND });
    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error fetching user:', error);
  }

  try {
    await client.disconnect();
    console.log('You have been disconnected');
  } catch (err) {
    console.error("Couldn't disconnect safely:", err);
  }
})();
