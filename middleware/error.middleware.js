const conf = require('../locals/ru').middleware.serverError;
module.exports = async (ctx, next) => {
	try {
		await next();
	} catch (err) {
		console.log('Error handler:', err);
		return ctx.replyWithHTML(`${conf.text.error}`);
	}
};
