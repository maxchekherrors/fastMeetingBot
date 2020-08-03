const Invite = require('../models/invite');
const User = require('../models/user');
const Markup = require('telegraf/markup');
const Extra = require('telegraf/extra');
const getDistance = require('../../utils/getDistance');

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
    const {inviteId} = ctx;
    const {latitude, longitude} = ctx.message.location;
    await Invite.updateOne({_id: inviteId}, {
        $set: {location: {lat: latitude, lon: longitude}},
        ready: true
    });

    await ctx.reply('->beautiful place, yor invite successfully published)');
    await ctx.scene.enter('inviteAvailable');
};
exports.getInviteDescription = async ctx => {
    const {inviteId} = ctx;
    const desc = ctx.message.text;

    await Invite.updateOne({_id: inviteId}, {
        $set: {description: desc},
    });
    await ctx.reply('Nice description, you can send invite photo if you want. Or I will use your profile photo)',
        Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    // [markup.contactRequestButton('Send contact')],
                    ['Submit']
                ])
        }));

};


exports.dropInvite = async ctx => {
    const {inviteId} = ctx;
    await Invite.updateOne({_id: inviteId}, {
        endDate: Date.now()
    });
    await ctx.scene.enter('mainMenu');

};
exports.createInvite = async ctx => {
    const {userId} = ctx;
    const invite = await new Invite({
        userId: userId
    }).save();
    await User.updateOne({_id: userId}, {lastInvite: invite._id});
    ctx.reply("Tell me about your invite your can write short description");
};
exports.getInvitePhoto = async ctx => {
    const {inviteId} = ctx;
    const photo = ctx.message.photo[0].file_id;
    await Invite.updateOne({_id: inviteId}, {
        photo: photo
    }).then(console.log);
    await ctx.reply('Ouu, have a nice dickkkk, respect!');


};
exports.findFriends = async ctx => {
    const {inviteId} = ctx;
    await ctx.reply('Your invite is published, liveTime of invite 30 min, your can delete it prematurely',
        Extra.markup((markup) => {
            return markup.resize()
                .keyboard([
                    ['Drop Invite']
                ]).oneTime()
        }));
    const invite = await Invite.findOne({_id: inviteId});
    const friends = await invite.findAround();
    console.log(friends.length);
    friends.forEach(async friend => {
        const distance = getDistance(invite.location, friend.location);
        const friendInfo = await friend.getFullDescription();
        const myInfo = await invite.getFullDescription();
        /*await ctx.replyWithPhoto(friend.photo,
            Extra.load({ caption: `📍${distance}\n ${friendInfo}` })
                .markdown()
                .markup((m) =>
                    m.inlineKeyboard([
                        m.callbackButton('❌', 'ignore'),
                        m.callbackButton('❤️', friend._id)
                    ])
                )
        );
        await ctx.sendPhoto(friend.userId,invite.photo,
            Extra.load({ caption: `📍${distance}\n ${myInfo}` })
                .markdown()
                .markup((m) =>
                    m.inlineKeyboard([
                        m.callbackButton('❌', 'ignore'),
                        m.callbackButton('❤️', invite._id)
                    ])
                ));*/
        await ctx.reply(`📍${distance}\n ${friendInfo}`,createInviteKeyboard(friend._id));
        await ctx.sendMessage(friend.userId,`📍${distance}\n ${myInfo}`,createInviteKeyboard(invite._id));
    })
};


function createInviteKeyboard(minviteId){
    return Markup.inlineKeyboard([
        Markup.callbackButton('❌', 'ignore'),
        Markup.callbackButton('❤️', inviteId)
    ]).extra()
}
/*
function compilIvent(ivent){
    ctx.replyWithPhoto(user.photo,
        Extra.caption(`*${user.fullName}*\n_Age:_ *${user.age}*\n_About:_ *${user.description}*\n_Account status:_ *${user.phoneNumber ? 'verified' : 'unverified'}*`).markdown()
    );
}*/
