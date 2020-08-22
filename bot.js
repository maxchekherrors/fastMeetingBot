
const {Telegraf} = require('telegraf');

const session = require('telegraf/session');
const applyBotMiddleware = require('./botApi');
const errorMiddleware = require('./middleware/error.middleware');
const validationMiddleware = require('./middleware/validation.middleware');
const spamMiddleware = require('./middleware/spam.middlewaer');
const queueMiddleware = require('./middleware/queue.middleware')('mainMenu');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(Telegraf.log());
bot.use(session());
bot.use(spamMiddleware);
bot.use(validationMiddleware);
bot.use(queueMiddleware);
bot.use(errorMiddleware);

applyBotMiddleware(bot);

bot.help(async (ctx) => {
	await ctx.reply('interesting information');
});
module.exports = bot;