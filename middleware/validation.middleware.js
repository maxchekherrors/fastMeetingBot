const User = require('../bot/models/user');
module.exports = async (ctx, next) => {
    const userId = ctx.from.id;
    const username = ctx.from.username;
    if(!username)
        return ctx.reply('You need username, to use me!');
    if (!ctx.message||ctx.message.text !== '/start'){
        const user = await User.findOne({_id: userId}, 'lastInvite');
        if (!user)
            return ctx.reply('Go /start vasilii');
        else {
            ctx.userId = userId;
            ctx.inviteId = user.lastInvite;

        }
    }
    return next();
};