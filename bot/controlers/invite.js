const Invite = require('../models/invite');
const User = require('../models/user');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const getDistance = require('../../utils/getDistance');

exports.askLocation =  ctx => {
    return ctx.reply('Ok, now, send me your location and I find friends for you.', Extra.markup((markup) => {
        return markup.resize()
            .keyboard([
                markup.locationRequestButton('Send location')
            ]).oneTime();
    }));
};
exports.submit =  ctx => ctx.scene.enter('inviteLocation');
exports.gteLocation = async ctx => {
    const {inviteId} = ctx;
    const {latitude, longitude} = ctx.message.location;
    await Invite.updateOne({_id: inviteId}, {
        $set: {location: {lat: latitude, lon: longitude}},
        ready: true
    });

    //await ctx.reply('->beautiful place, yor invite successfully published)');
    return ctx.scene.enter('inviteAvailable');
};
exports.getInviteDescription = async ctx => {
    const {inviteId} = ctx;
    const desc = ctx.message.text;

    await Invite.updateOne({_id: inviteId}, {
        $set: {description: desc},
    });
    return ctx.reply('Nice description, you can send invite photo if you want. Or I will use your profile photo)',
        Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    ['Submit']
                ])
        }));

};
exports.dropInvite = async ctx => {
    const {inviteId} = ctx;
    await Invite.updateOne({_id: inviteId}, {
        endDate: Date.now()
    });
    return ctx.scene.enter('mainMenu');

};
exports.createInvite = async ctx => {
    const {userId} = ctx;
    const invite = await new Invite({
        userId: userId
    }).save();
    await User.updateOne({_id: userId}, {lastInvite: invite._id});
    return ctx.reply("Tell me about your invite your can write short description");
};
exports.getInvitePhoto = async ctx => {
    const {inviteId} = ctx;
    const photo = ctx.message.photo[0].file_id;
    await Invite.updateOne({_id: inviteId}, {
        photo: photo
    });
    return ctx.reply('Ouu, have a nice dickkkk, respect!');


};
exports.findFriends = async ctx => {
    const {userId, inviteId} = ctx;
    await ctx.reply('Your invite is published, liveTime of invite 30 min, your can delete it prematurely',
        Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    ['Drop Invite']
                ]).oneTime()
        }));
    const invite = await Invite.findOne({_id: inviteId});
    const friends = await invite.findAround();
    if (friends.length === 0)
        return ctx.reply('I did not find invitations nearby. Just wait.');
    else
        friends.forEach(async friend => {
            const distance = Math.floor(getDistance(invite.location, friend.location));
            await shareInvite(ctx.telegram, userId, friend, distance);
            await shareInvite(ctx.telegram, friend.userId, invite, distance);
        })
};

exports.likeInvite = async ctx=>{
      const{inviteId} = ctx;
      const likedId = ctx.callbackQuery.data;
      Invite.updateOne({_id:likedId},{
          $push:{ agreedInvitations:inviteId}
      });
};

async function shareInvite(telegram, userId, invite, dis) {
    const info = await invite.getFullDescription();
    let photo = invite.photo;
    if (photo.length === 0) {
        const user = await User.findOne({_id: invite.userId}, 'photo');
        photo = user.photo;
    }
    return telegram.sendPhoto(userId, photo,
        Extra.load({caption: `📍${dis}\n ${info}`})
            .markdown()
            .markup((m) =>
                m.inlineKeyboard([
                    m.callbackButton('❌', 'ignore'),
                    m.callbackButton('❤️', invite._id)
                ])
            ));
}
