const Scene = require('telegraf/scenes/base');
const simpleAnswer = require('../../utils/createMsgAnsw');
const {
	askLocation,
	gteLocation,
	getInviteDescription,
	getInvitePhoto,
	findFriends, dropInvite,
	submit, createInvite, agreeInvite,} = require('./invite.controler');

const inviteLocation = new Scene('inviteLocation');
const inviteDescription = new Scene('inviteDescription');
const inviteAvailable = new Scene('inviteAvailable');

inviteDescription.enter(createInvite);
inviteDescription.hears('Submit', submit);
inviteDescription.on('text', getInviteDescription);
inviteDescription.on('photo', getInvitePhoto);
inviteDescription.on('message', simpleAnswer('<b>Description can consists of text and photo</b>'));


inviteLocation.enter(askLocation);
inviteLocation.on('location', gteLocation);
inviteLocation.on('message', simpleAnswer('Send me your location, fagot!'));


inviteAvailable.enter(findFriends);
inviteAvailable.hears('Drop Invite', dropInvite);
inviteAvailable.action('ignore', (ctx) => ctx.deleteMessage());
inviteAvailable.on('callback_query', agreeInvite);
inviteAvailable.on('message', simpleAnswer('Yuo can drop invite, if you want go back to menu'));

module.exports = {
	inviteLocation,
	inviteDescription,
	inviteAvailable
};
