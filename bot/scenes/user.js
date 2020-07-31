/*const Telegraf = require('telegraf');
const session = require('telegraf/session');
const Stage = require('telegraf/stage');*/
const Scene = require('telegraf/scenes/base');
const{getAge,getDescription,createOrUpdate,menu} = require('../controlers/user');

const profileAge = new Scene('profileAge');
const profileDescription = new Scene('profileDescription');
const profileUpdate = new Scene('profileUpdate');
const mainMenu = new Scene('mainMenu');




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

profileAge.on('text',getAge);

profileDescription.on('text',getDescription);

exports.profileAge = profileAge;
exports.profileDescription = profileDescription;
exports.profileAge = profileAge;
exports.profileDescription = profileDescription;
exports.profileUpdate = profileUpdate;
exports.mainMenu = mainMenu;