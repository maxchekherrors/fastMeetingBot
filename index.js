'use strict';
const config = require('./config');
const mongoose = require('mongoose');
const bot = require('./bot');
const app = require('./server');


async function bootstrap() {
	await mongoose.connect(`${config.database.connectionString}`, {useNewUrlParser: true});
	if(config.env === 'production') {
		await bot.telegram.setWebhook(`${config.bot.webHook}`);
	}
	else{
		await bot.launch();
	}
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