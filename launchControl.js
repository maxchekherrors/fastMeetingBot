'use strict';
const config = require('./config');
const mongoose = require('mongoose');
const bot = require('./bot');
const app = require('./server');


async function bootstrap() {
	await mongoose.connect(`${config.database.connectionString}`, {useNewUrlParser: true});
	if(config.isDevelopment||config.isTest) {
		await bot.launch();

	}
	else{
		await bot.telegram.setWebhook(`${config.bot.webHook}`);
	}

	return app.listen(`${config.server.port}`);
}
async function shutdown() {
	await mongoose.connection.close();
	await bot.stop();
	return app.close();

}
module.exports = {shutdown,bootstrap};