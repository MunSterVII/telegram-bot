require('dotenv').config();
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

const apiId = Number(process.env.API_ID);
const apiHash = process.env.API_HASH;

(async () => {
  const stringSession = new StringSession(process.env.STRING_SESSION || ""); // fill this later with the value from session.save()

  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start();

  console.log("You should now be connected.");

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
