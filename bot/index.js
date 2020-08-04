const User = require('./models/user');
const Stage = require('telegraf/stage');

const Scenes = require('./scenes');
const stage = new Stage(Scenes, {default:'mainMenu'});
const userValidation = async (ctx, next) => {
    const userId = ctx.from.id;
    if (!ctx.message||ctx.message.text !== '/start')
        if (!await User.exists({_id: userId}))
            return ctx.reply('Go /start vasilii');
        else {
            const user = await User.findOne({_id: userId}, 'lastInvite')
            ctx.userId = userId;
            ctx.inviteId = user.lastInvite;

        }

    return next();
};

module.exports = function (bot) {
    bot.use(userValidation);
    bot.use(stage.middleware());

};