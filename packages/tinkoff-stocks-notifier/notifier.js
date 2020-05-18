require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const Agent = require('socks5-https-client/lib/Agent');
const monitor = require('@mishannn/tinkoff-stocks-monitor');

const telegramBotOptions = {};

if (process.env.TELEGRAM_USE_TOR) {
  telegramBotOptions.request = {
    agentClass: Agent,
    agentOptions: {
      socksHost: '127.0.0.1',
      socksPort: 9150,
    },
  };
}

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, telegramBotOptions);

const monitorInstance = new monitor.Monitor({
  apiUrl: process.env.TINKOFF_INVEST_API_URL,
  secretToken: process.env.TINKOFF_INVEST_SECRET_TOKEN,
});

monitorInstance.start(
  {
    tickers: ['GOOGL', 'GOOG', 'MSFT', 'MA', 'V', 'AAPL', 'AMD', 'INTC', 'FB', 'ADBE', 'NVDA', 'LRCX', 'JNJ'],
    secondsInterval: 30,
    notifyStepPercents: 0.5,
  },
  notifications => {
    if ('error' in notifications) {
      const message = `<b>ERROR</b>: ${notifications.error.message}`;
      bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message, { parse_mode: 'HTML' });
      return;
    }

    const filteredNotifications = notifications.filter(notification => Boolean(notification));

    if (filteredNotifications.every(notification => !notification.diff)) return;

    const messages = filteredNotifications.map(notification => {
      const message = `<b>${notification.ticker}</b> (${notification.name}): ${notification.price} ${notification.currency}`;

      if (!notification.diff) {
        return message;
      }

      const diffValueFixed = notification.diff.value.toFixed(2);
      const percentsValueFixed = notification.diff.percents.toFixed(2);

      return `${message} <b>(${diffValueFixed} ${notification.currency}, ${percentsValueFixed}%)</b>`;
    });

    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, messages.join('\n'), { parse_mode: 'HTML' });
  },
);
