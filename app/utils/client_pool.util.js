import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';

const clients = new Map();

/**
 * Get a TelegramClient for a given session
 * @param {String} sessionId - The session ID for the client
 * @param {Number} apiId - The Telegram API ID
 * @param {String} apiHash - The Telegram API hash
 * @returns {TelegramClient} - The TelegramClient object
 */
export const getClient = async (sessionId, apiId, apiHash) => {
  const key = `${sessionId}:${apiId}:${apiHash}`;

  // Check if client already exists in pool
  if (clients.has(key)) {
    // TODO: Check if client is connected
    return clients.get(key);
  }
  // Create new client and add to pool
  const session = new StringSession(sessionId);
  const client = new TelegramClient(session, apiId, apiHash, { connectionRetries: 5 });
  await client.connect({ onError: (err) => console.log(err) });
  clients.set(key, client);

  return client;
};
