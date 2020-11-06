//TODO tests;)
const config = require('../config');
const lcl = require('../locals/ru');
const TelegrafTest = require('telegraf-test');
//const {bootstrap,/*shutdown*/} = require('../launchControl');
const user = new TelegrafTest({
	url: `${config.bot.webHook}`
});
user.setUser({
	id: 522658339,
	username: '@test'
});
//beforeAll( () =>  bootstrap().then(()=>console.log('Ok')));
//afterAll( () =>shutdown());
describe('Bot menu',()=>{
	const{text,buttons} = lcl.menu;
	test('Incorrect input',async()=>{
		const res = await user.sendMessageWithText('123');
		expect(res.data.method).toEqual('sendMessage');
		expect(res.data.text).toEqual(`${text.enter}`);
	});
	test('Show profile button',async()=>{
		const res = await user.sendMessageWithText(`${buttons.showProfile}`);
		expect(res.data.method).toEqual('sendPhoto');
		expect(res.data.caption).toBeTruthy();

	});
	test('Edit profile button',async()=>{
		const res = await user.sendMessageWithText(`${buttons.editProfile}`);
		expect(res.data.method).toEqual('sendMessage');
		expect(res.data.reply_markup).toBeTruthy();

	});
});
describe('Bot profile',()=>{
	const{text} = lcl.profile.edit;
	test('Incorrect input',async()=>{
		const res = await user.sendMessageWithText('123');
		expect(res.data.method).toEqual('sendMessage');
		expect(res.data.text).toEqual(`${text.enter}`);
		expect(res.data.reply_markup).toBeTruthy();
	});
});

