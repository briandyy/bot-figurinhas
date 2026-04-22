const { startBot } = require('./src/services/bot');

startBot().catch((error) => {
  console.error('[FATAL]', error);
  process.exit(1);
});
