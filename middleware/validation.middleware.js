const User = require('../botApi/user/user.model');
const Extra = require('telegraf/extra');
const conf = require('../locals/ru').middleware.validation;
module.exports = async (ctx, next) => {
    const userId = ctx.from.id;
    const user = await User.findOne({_id: userId}, 'lastInvite');
    if (!user) {
        if (!ctx.message || ctx.message.text !== '/start')
            await ctx
                .replyWithAudio(`${conf.files.errorAudio}`, Extra
                    .load({caption: `${conf.text.error}`}));
    } else {
        ctx.userId = userId;
        ctx.inviteId = user.lastInvite;
    }

    return next();
};