/*const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');*/
const Scene = require('telegraf/scenes/base');
const{getAge,getDescription,createOrUpdate,menu,getProfilePhoto,getContact,askContact} = require('../controlers/user');

const profileAge = new Scene('profileAge');
const profileDescription = new Scene('profileDescription');
const profileUpdate = new Scene('profileUpdate');
const mainMenu = new Scene('mainMenu');
const profilePhoto = new Scene('profilePhoto');
const profileContact = new Scene('profileContact');

profilePhoto.enter(async ctx =>{
    await ctx.reply("Show me your fucking face, dear)")
});
profilePhoto.on('photo', getProfilePhoto);

profileContact.hears('NO',async ctx=>ctx.scene.enter('mainMenu'));

profileContact.enter(askContact);

profileContact.on('contact',getContact);

profileDescription.enter(async ctx =>{
   await ctx.reply("Tell me about you:")
});
profileAge.enter(async ctx=>{
    await ctx.reply('How old are you ?');
});
mainMenu.enter(menu);
profileUpdate.enter(createOrUpdate);

mainMenu.hears('Edit profile',async ctx=>await ctx.scene.enter('profileUpdate'));
mainMenu.hears('Create invite',async ctx=>await ctx.scene.enter('inviteDescription'));
mainMenu.hears('Share phone',async ctx=>await ctx.scene.enter('inviteDescription'));
mainMenu.hears('Show profile',async ctx=>await ctx.scene.enter('inviteDescription'));

profileAge.on('text',getAge);

profileDescription.on('text',getDescription);

exports.profileUpdate = profileUpdate;
exports.profileAge = profileAge;
exports.profileDescription = profileDescription;
exports.profilePhoto = profilePhoto;
exports.profileContact = profileContact;
exports.mainMenu = mainMenu;
