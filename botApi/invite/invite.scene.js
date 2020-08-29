const Scene = require('telegraf/scenes/base');
//const simpleAnswer = require('../../utils/createMsgAnsw');
const conf = require('../../locals/ru').invite;
const controllers = require('./invite.controller');
const {next} = controllers;
exports.inviteLocation = () => {
	const {inviteLocation} = controllers;
	const location = new Scene('inviteLocation');
	location.enter(inviteLocation.ask);
	location.hears(`${conf.location.buttons.undo}`,inviteLocation.undo);
	location.on('location', inviteLocation.get);
	location.on('message',inviteLocation.error);
	return location;
};

exports.inviteDescription = () => {
	const {inviteDescription} = controllers;
	const description = new Scene('inviteDescription');
	description.enter(inviteDescription.ask);
	description.hears(`${conf.description.buttons.submit}`, next);
	description.hears(`${conf.description.buttons.undo}`, inviteDescription.undo);
	description.on('text', inviteDescription.get);
	description.on('message', inviteDescription.error);
	return description;
};
exports.invitePhoto = ()=>{
	const {invitePhoto} = controllers;
	const photo = new Scene('invitePhoto');
	photo.enter(invitePhoto.ask);
	photo.hears(`${conf.photo.buttons.submit}`, next);
	photo.on('photo', invitePhoto.get);
	photo.on('message', invitePhoto.error);
	return photo;

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


