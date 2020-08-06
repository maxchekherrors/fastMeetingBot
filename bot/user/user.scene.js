/* const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage'); */
const Scene = require('telegraf/scenes/base');
const {
	getAge, getDescription, createOrUpdate, menu, getProfilePhoto, getContact, askContact, showProfile,
} = require('./user.controler');

const profileAge = new Scene('profileAge');
const profileDescription = new Scene('profileDescription');
const profileUpdate = new Scene('profileUpdate');
const mainMenu = new Scene('mainMenu');
const profilePhoto = new Scene('profilePhoto');
const profileContact = new Scene('profileContact');

profileUpdate.enter(createOrUpdate);

profileAge.enter((ctx) => ctx.reply('How old are you ?'));
profileAge.on('text', getAge);
profileAge.on('message', (ctx) => ctx.reply('Dont play with me!'));

profileDescription.enter((ctx) => ctx.reply('Tell me about you:'));
profileDescription.on('text', getDescription);
profileDescription.on('message', (ctx) => ctx.reply('It must be a little text description'));

profilePhoto.enter((ctx) => ctx.reply('Show me your fucking face, dear)'));
profilePhoto.on('photo', getProfilePhoto);
profilePhoto.on('message', (ctx) => ctx.reply('Is not your face!!!!'));

profileContact.enter(askContact);
profileContact.on('contact', getContact);
profileContact.hears('NO', (ctx) => ctx.scene.enter('mainMenu'));
profileContact.on('message', (ctx) => ctx.reply('Just choose between yes and no'));

mainMenu.enter(menu);
mainMenu.start(async (ctx) => await ctx.scene.enter('profileUpdate'));
mainMenu.hears('Edit profile', (ctx) => ctx.scene.enter('profileUpdate'));
mainMenu.hears('Create invite', (ctx) => ctx.scene.enter('inviteDescription'));
mainMenu.hears('Share phone', (ctx) => ctx.scene.enter('profileContact'));
mainMenu.hears('Show profile', showProfile);
mainMenu.on('message', (ctx) => ctx.scene.enter('mainMenu'));

exports.profileUpdate = profileUpdate;
exports.profileAge = profileAge;
exports.profileDescription = profileDescription;
exports.profilePhoto = profilePhoto;
exports.profileContact = profileContact;
exports.mainMenu = mainMenu;
