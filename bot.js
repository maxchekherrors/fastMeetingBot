'use strict';
const {Telegraf} = require('telegraf');
const config = require('./config');
const session = require('telegraf/session');
const applyBotMiddleware = require('./botApi');
const errorMiddleware = require('./middleware/error.middleware');
const validationMiddleware = require('./middleware/validation.middleware');
const spamMiddleware = require('./middleware/spam.middleware');
const massageParseMiddleware = require('./middleware/messageParse.middleware');
const queueMiddleware = require('./middleware/queue.middleware');

const bot = new Telegraf(config.bot.token);
if (config.isDevelopment)
	bot.use(Telegraf.log());
bot.use(session());
bot.use(spamMiddleware);
bot.use(massageParseMiddleware);
bot.use(validationMiddleware);
bot.use(queueMiddleware);
bot.use(errorMiddleware);
applyBotMiddleware(bot);

bot.help(async (ctx) => {
	await ctx.reply('interesting information');
});
module.exports = bot;