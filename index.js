'use strict';
require('dotenv').config();
const config = require('./config');
const Koa = require('koa');
const koaBody = require('koa-body');
const mongoose = require('mongoose');
const bot = require('./bot');

const app = new Koa();

app.use(koaBody());
app.use(async (ctx, next) => {
	if (ctx.method !== 'POST' || ctx.url !== `/${config.bot.password}`) {
		return next();
	}
	await bot.handleUpdate(ctx.request.body, ctx.response);
	ctx.status = 200;
});
app.use(async (ctx) => {
	ctx.body = 'Hello from fast meeting bot!';
});
async function bootstrap() {
	await mongoose.connect(`${config.database.connectionString}`, {useNewUrlParser: true});
	await bot.telegram.setWebhook(`${config.bot.webHook}`);
	return app.listen(`${config.server.port}`);
}

bootstrap()
	.then((server) => {
		console.log(`🚀 Server listening on port ${server.address().port}!`);
	})
	.catch(err => {
		setImmediate(() => {
			console.error('Unable to run the server because of the following error:');
			console.error(err);
			process.exit();
		});
	});