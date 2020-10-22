//TODO tests;)


const axios = require('axios');
const config = require('../config');
describe('Server', () => {
	test('is running', async() => {
		const res = await axios.get(`http://localhost:${config.server.port}/`);
		expect(res.data).toEqual('Welcome to the FastMeeting bot body;)');
	});
});
/*const TelegrafTest = require('telegraf-test');
const user = new TelegrafTest({
	url: `${config.bot.webHook}`
});

user.setUser({
	id: 522658339,
	username: '@test'
});
test('Bot',async()=>{
	const res = await user.sendMessageWithText('123');
	expect(res.data.text).toEqual('<b>Меню</b>');
});*/
