const Scene = require('telegraf/scenes/base');
const simpleAnswer = require('../../utils/createMsgAnsw');
const conf = require('../../locals/ru').invite;
const {
	askLocation,
	gteLocation,
	getInviteDescription,
	getInvitePhoto,
	findFriends, dropInvite,
	submit, createInvite, agreeInvite,} = require('./invite.controler');

exports.inviteLocation = ()=>{
	const inviteLocation = new Scene('inviteLocation');
	inviteLocation.enter(askLocation);
	inviteLocation.on('location', gteLocation);
	inviteLocation.on('message', simpleAnswer(`${conf.location.text.error}`));
	return inviteLocation;
};

exports.inviteDescription = ()=>{
	const inviteDescription = new Scene('inviteDescription');
	inviteDescription.enter(createInvite);
	inviteDescription.hears(`${conf.description.buttons.submit}`, submit);
	inviteDescription.on('text', getInviteDescription);
	inviteDescription.on('photo', getInvitePhoto);
	inviteDescription.on('message', simpleAnswer(`${conf.description.text.error}`));
	return inviteDescription;
};

exports.inviteAvailable = ()=>{
	const inviteAvailable = new Scene('inviteAvailable');
	inviteAvailable.enter(findFriends);
	inviteAvailable.hears(`${conf.available.buttons.drop}`, dropInvite);
	inviteAvailable.action('ignore', (ctx) => ctx.deleteMessage());
	inviteAvailable.on('callback_query', agreeInvite);
	inviteAvailable.on('message', simpleAnswer(`${conf.available.text.error}`));
	return inviteAvailable;
};


