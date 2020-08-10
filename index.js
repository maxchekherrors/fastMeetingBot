require('dotenv').config();
const {Telegraf} = require('telegraf');
const mongoose = require('mongoose');
const session = require('telegraf/session');
const applyBotMiddleware = require('./bot');
const errorMiddleware = require('./middleware/error.middleware');
const validationMiddleware = require('./middleware/validation.middleware');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(Telegraf.log());
bot.use(session());
bot.use(validationMiddleware);
bot.use(errorMiddleware);

applyBotMiddleware(bot);

bot.help(async (ctx) => {
	await ctx.reply('interesting information');
});

mongoose.connect(process.env.DATABASE_CONNECTION, {useNewUrlParser: true})
	.then(() => {
	    bot.launch().then(() => {
			console.log('Bot is started!');
		});
	});
