
const Scene = require('telegraf/scenes/base');
const simpleAnswer = require('../../utils/createMsgAnsw');
const conf = require('../../locals/ru').profile;
const {
	getAge, getDescription,
	createOrUpdate, menu,
	getProfilePhoto, getContact,
	askContact, showProfile,
	getProfileSex,askProfileSex
} = require('./user.controler');

exports.profileUpdate = () => {
	const update = new Scene('profileUpdate');
	update.enter(createOrUpdate);
	return update;
};

exports.profileAge = () => {
	const age = new Scene('profileAge');
	age.enter(simpleAnswer(`${conf.age.text.enter}`));
	age.on('text', getAge);
	age.on('message', simpleAnswer(`${conf.age.text.error}`));
	return age;
};
exports.profileDescription = () => {
	const description = new Scene('profileDescription');
	description.enter(simpleAnswer(`${conf.description.text.enter}`));
	description.hears(`${conf.description.buttons.submit}`,ctx=>ctx.scene.enter('profilePhoto'));
	description.on('text', getDescription);

	description.on('message', simpleAnswer(`${conf.description.text.error}`));
	return description;
};
exports.profilePhoto = () => {
	const photo = new Scene('profilePhoto');
	photo.enter(simpleAnswer(`${conf.photo.text.enter}`));
	photo.on('photo', getProfilePhoto);
	photo.on('message', simpleAnswer(`${conf.photo.text.error}`));
	return photo;
};


exports.profileContact = () => {
	const contact = new Scene('profileContact');
	contact.enter(askContact);
	contact.hears(`${conf.contact.buttons.refuse}`, (ctx) => ctx.scene.enter('mainMenu'));
	contact.on('contact', getContact);
	contact.on('message', simpleAnswer(`${conf.contact.text.error}`));
	return contact;
};


exports.mainMenu = () => {
	const mainMenu = new Scene('mainMenu');
	mainMenu.enter(menu);
	mainMenu.start( (ctx) =>  ctx.scene.enter('profileUpdate'));
	mainMenu.hears(`${conf.menu.buttons.editProfile}`, async (ctx) => {

		return ctx.scene.enter('profileUpdate');
	});
	mainMenu.hears(`${conf.menu.buttons.createInvite}`, async (ctx) => {
		return ctx.scene.enter('inviteDescription');
	});
	mainMenu.hears(`${conf.menu.buttons.setContact}`, async (ctx) => {

		return ctx.scene.enter('profileContact');
	});
	mainMenu.hears(`${conf.menu.buttons.showProfile}`, showProfile);
	mainMenu.on('message', (ctx) => ctx.scene.enter('mainMenu'));
	return mainMenu;
};
exports.profileSex = ()=>{
	const sex = new Scene('profileSex');
	sex.enter(askProfileSex);
	sex.on('text',getProfileSex);
	sex.on('message',simpleAnswer(conf.sex.text.error));
	return sex;
};

