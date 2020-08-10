/* const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage'); */
const Scene = require('telegraf/scenes/base');
const simpleAnswer = require('../../utils/createMsgAnsw');
const {
	getAge, getDescription,
	createOrUpdate, menu,
	getProfilePhoto, getContact,
	askContact, showProfile,} = require('./user.controler');


const profileUpdate = new Scene('profileUpdate');
profileUpdate.enter(createOrUpdate);

const profileAge = new Scene('profileAge');
profileAge.enter((ctx) => ctx.reply('How old are you ?'));
profileAge.on('text', getAge);
profileAge.on('message', simpleAnswer('Dont play with me!'));

const profileDescription = new Scene('profileDescription');
profileDescription.enter(simpleAnswer('Tell me about you:'));
profileDescription.on('text', getDescription);
profileDescription.on('message', simpleAnswer('It must be a little text description'));

const profilePhoto = new Scene('profilePhoto');
profilePhoto.enter( simpleAnswer('Show me your fucking face, dear)'));
profilePhoto.on('photo', getProfilePhoto);
profilePhoto.on('message', simpleAnswer('Is not your face!!!!'));

const profileContact = new Scene('profileContact');
profileContact.enter(askContact);
profileContact.hears('NO', (ctx) => ctx.scene.enter('mainMenu'));
profileContact.on('contact', getContact);
profileContact.on('message', simpleAnswer('Just choose between yes and no'));

const mainMenu = new Scene('mainMenu');
mainMenu.enter(menu);
mainMenu.start(async (ctx) => await ctx.scene.enter('profileUpdate'));
mainMenu.hears('Edit profile', (ctx) => ctx.scene.enter('profileUpdate'));
mainMenu.hears('Create invite', (ctx) => ctx.scene.enter('inviteDescription'));
mainMenu.hears('Share phone', (ctx) => ctx.scene.enter('profileContact'));
mainMenu.hears('Show profile', showProfile);
mainMenu.on('message', (ctx) => ctx.scene.enter('mainMenu'));

module.exports = {
	profileUpdate,
	profileAge,
	profileDescription,
	profilePhoto,
	profileContact,
	mainMenu
};
