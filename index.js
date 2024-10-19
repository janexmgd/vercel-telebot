import { startServer } from './src/apps/server.js';
import { startBot } from './src/apps/bot.js';

const main = async () => {
  process.stdout.write('\x1Bc');
  await startBot();
  if (process.env.NODE_ENV == 'PRODUCTION') {
    console.log('production');

    startServer();
  } else {
    console.log('Running in development mode, server not started.');
  }
};

main().catch((error) => {
  console.error('Error starting application:', error);
});
