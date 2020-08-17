const Scene = require('telegraf/scenes/base');
const simpleAnswer = require('../../utils/createMsgAnsw');
const conf = require('../../locals/ru').invite;
const {
	askLocation,
	gteLocation,
	getInviteDescription,
	getInvitePhoto,
	findFriends, dropInvite,
	submit, createInvite, agreeInvite,
	undo,} = require('./invite.controler');

exports.inviteLocation = () => {
	const location = new Scene('inviteLocation');
	location.enter(askLocation);
	location.hears(conf.location.buttons.undo,undo);
	location.on('location', gteLocation);
	location.on('message', simpleAnswer(`${conf.location.text.error}`));
	return location;
};

exports.inviteDescription = () => {
	const description = new Scene('inviteDescription');
	description.enter(createInvite);
	description.hears(`${conf.description.buttons.submit}`, submit);
	description.on('text', getInviteDescription);
	description.on('photo', getInvitePhoto);
	description.on('message', simpleAnswer(`${conf.description.text.error}`));
	return description;
};

exports.inviteAvailable = () => {
	const available = new Scene('inviteAvailable');
	available.enter(findFriends);
	available.hears(`${conf.available.buttons.drop}`, dropInvite);
	available.action('ignore', (ctx) => ctx.deleteMessage());
	available.on('callback_query', agreeInvite);
	available.on('message', simpleAnswer(`${conf.available.text.error}`));
	return available;
};


