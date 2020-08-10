const User = require('../bot/user/user.model');
module.exports = async (ctx, next) => {
	const userId = ctx.from.id;
	if (!ctx.message||ctx.message.text !== '/start'){
		const user = await User.findOne({_id: userId}, 'lastInvite phoneNumber');
		if (!user)
			return ctx.reply('Go /start vasilii');
		else {
			ctx.userId = userId;
			ctx.inviteId = user.lastInvite;
			ctx.verifide = !!user.phoneNumber;

		}
	}
	return next();
};