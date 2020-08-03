require('dotenv').config();

const mongoose = require('mongoose');
const {Telegraf} = require('telegraf');
const session = require('telegraf/session');
const applyBotMidelwayers = require('./bot');


const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(Telegraf.log());
bot.use(session());

applyBotMidelwayers(bot);
bot.start(async ctx=>{
   await ctx.scene.enter('profileUpdate');
});
bot.help(async ctx=>{
    await ctx.reply('interesting information');
});


mongoose.connect(process.env.DATABASE_CONNECTION, {useNewUrlParser: true}).then(() => {
    bot.launch().then(()=>{
        console.log('Bot is started!');
    });
});