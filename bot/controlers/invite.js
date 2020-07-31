const Invite = require('../models/invite');
const User = require('../models/user');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');

exports.askLocation = async ctx => {
    ctx.reply('Ok, now, send me your location and I find friends for you.', Extra.markup((markup) => {
        return markup.resize()
            .keyboard([
                markup.locationRequestButton('Send location')
            ]).oneTime();
    }));
};
exports.submit = async ctx => {
    /*const userId = ctx.message.from.id;
    const user = await User.findOne({_id: userId}, 'lastInvite');
    await Invite.updateOne({_id: user.lastInvite},{
        ready:true
    });*/
    await ctx.scene.enter('inviteLocation');
};
exports.gteLocation = async ctx => {
    const userId = ctx.message.from.id;
    const {latitude, longitude} = ctx.message.location;
    const user = await User.findOne({_id: userId}, 'lastInvite');
    await Invite.updateOne({_id: user.lastInvite},{
        $set:{location: {lat: latitude, long: longitude}},
        ready:true
    });

    await ctx.reply('->beautiful place, yor invite successfully published)');
    await ctx.scene.enter('inviteAvailable');
};
exports.getInviteDescription = async ctx => {
    const userId = ctx.message.from.id;
    const desc = ctx.message.text;
    const user = await User.findOne({_id: userId}, 'lastInvite');
    await Invite.updateOne({_id: user.lastInvite},{
        $set:{description: desc},
    });
    await ctx.reply('Nice description, you can send photo or share your phone if you want.',
        Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    [markup.contactRequestButton('Send contact')],
                    ['Submit']
                ])
        }));

};
exports.getContact = async ctx=>{
    const userId = ctx.message.from.id;
    const phone = ctx.message.contact.phone_number;
    await User.updateOne({_id:userId},{$set:{phoneNumber:phone}});
    await ctx.reply('ouuuuu, all sexy chiks will call you!) bro');

};
exports.findFriends = async ctx => {
    const userId = ctx.message.from.id;
    await ctx.reply('Your invite is published, liveTime of invite 30 min, your can delete it prematurely',
        Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    ['Drop Invite']
                ]).oneTime()
        }));
    const user = await User.findOne({_id: userId}, 'lastInvite');
    const invite  = await Invite.findOne({_id:user.lastInvite});
    const friends = invite.findAround();



};
exports.dropInvite = async ctx => {
    const userId = ctx.message.from.id;
    const user = await User.findOne({_id: userId}, 'lastInvite');
    await Invite.updateOne({_id: user.lastInvite}, {
       endDate: Date.now()
    });
    await ctx.scene.enter('mainMenu');

};
exports.createInvite = async ctx=>{
    const userId = ctx.message.from.id;
    const invite = await new Invite({
        userId: userId
    }).save();
    await User.updateOne({_id: userId}, {lastInvite: invite._id});
    ctx.reply("Tell me about your invite your can write short description");
};
exports.getInvitePhoto = async ctx => {
    const userId = ctx.message.from.id;
    const photo = ctx.message.photo[0].file_id;
    const user = await User.findOne({_id: userId}, 'lastInvite');
    await Invite.updateOne({_id: user.lastInvite}, {
        photo: photo
    }).then(console.log);
    await ctx.reply('Ouu, have a nice dickkkk, respect!');

};