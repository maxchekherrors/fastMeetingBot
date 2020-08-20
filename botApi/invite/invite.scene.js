const Scene = require('telegraf/scenes/base');
//const simpleAnswer = require('../../utils/createMsgAnsw');
const conf = require('../../locals/ru').invite;
const controllers = require('./invite.controller');
const {next} = controllers;
exports.inviteLocation = () => {
	const {inviteLocation} = controllers;
	const location = new Scene('inviteLocation');
	location.enter(inviteLocation.ask);
	location.hears(conf.location.buttons.undo,inviteLocation.undo);
	location.on('location', inviteLocation.get);
	location.on('message',inviteLocation.error);
	return location;
};

exports.inviteDescription = () => {
	const {inviteDescription} = controllers;
	const description = new Scene('inviteDescription');
	description.enter(inviteDescription.ask);
	description.hears(`${conf.description.buttons.submit}`, next);
	description.on('text', inviteDescription.get);
	description.on('photo', inviteDescription.getPhoto);
	description.on('message', inviteDescription.error);
	return description;
};

exports.inviteAvailable = () => {
	const {inviteAvailable} = controllers;
	const available = new Scene('inviteAvailable');
	available.enter(inviteAvailable.find);
	available.hears(`${conf.available.buttons.drop}`, inviteAvailable.drop);
	available.action('ignore', (ctx) => ctx.deleteMessage());
	available.on('callback_query', inviteAvailable.agree);
	available.on('message',inviteAvailable.error);
	return available;
};


