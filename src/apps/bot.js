// bot.js
import { Telegraf } from 'telegraf';
import axios from 'axios';
import { configDotenv } from 'dotenv';
import handleBot from '../utils/handleBot.js';
configDotenv();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const URI = `/webhook/${process.env.BOT_TOKEN}`;
const SERVER_URL = process.env.VERCEL_URL || 'my-site.vercel.app';
const webhookURL = `https://${SERVER_URL}${URI}`;

if (!process.env.BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not defined in environment variables');
}

export const bot = new Telegraf(process.env.BOT_TOKEN);
handleBot(bot);
export const setupWebhook = async () => {
  try {
    const url = `${TELEGRAM_API}/setWebhook?url=${webhookURL}&drop_pending_updates=true`;
    console.log(`Setting up webhook with URL: ${url}`);
    const { data } = await axios.get(url);
    console.log('Webhook response:', data);
  } catch (error) {
    console.error('Error setting up webhook:', error);
    throw error;
  }
};

export const deleteWebhook = async () => {
  try {
    const url = `${TELEGRAM_API}/deleteWebhook?drop_pending_updates=true`;
    const { data } = await axios.get(url);
    console.log('Deleted current webhook:', data);
  } catch (error) {
    console.error('Error deleting webhook:', error);
    throw error;
  }
};

export const startBot = async () => {
  if (process.env.NODE_ENV === 'production') {
    await setupWebhook();
    console.log('Bot is running with webhook');
  } else {
    await deleteWebhook();
    bot.launch();
    console.log('Bot is running with polling in development');
  }
};
