'use strict';
const{bootstrap} = require('./launchControl');

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