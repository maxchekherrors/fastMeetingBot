const User = require('../models/user');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
exports.createOrUpdate = async ctx =>{
    const from = ctx.message.from;
    const user = {
        _id: from.id,
        firstName: from.first_name,
        lastName: from.last_name,
        userName: from.username,
    };
    if (!await User.exists({_id: from.id})) {
        await new User(user).save();
        await ctx.reply(`Welcome to the club ${user.firstName}`);
    } else {
        await User.updateOne({_id: from.id}, {user});
        await ctx.reply(`Nice to see you again ${user.firstName}`);
    }

    await ctx.scene.enter('profileAge');
};
exports.menu = async ctx =>{
    await ctx.reply('Menu',
        Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    ['Edit profile'],
                    ['Create invite']
                ]).oneTime()
        }));
};
exports.getAge = async ctx =>{

    const userId = ctx.message.from.id;
    const age = Number(ctx.message.text);


    if(!age||age<5||age>90){

        await ctx.reply("Is not your age!!!");
        await ctx.scene.reenter();
    }else{

        await User.updateOne({_id: userId},{age:age});
        await ctx.reply("OK, cool");
        await ctx.scene.enter('profileDescription');
    }
};
exports.getDescription = async ctx =>{
    const userId = ctx.message.from.id;
    const desc = ctx.message.text;
    await User.updateOne({_id: userId},{description:desc});
    await ctx.reply('Ok, lets go!!!!!');

    await ctx.scene.enter('mainMenu');

};
