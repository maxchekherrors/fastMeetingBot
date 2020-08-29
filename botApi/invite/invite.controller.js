//const Markup = require('telegraf/markup');
const Invite = require('./invite.model');
const User = require('../user/user.model');
const Extra = require('telegraf/extra');
const getDistance = require('../../utils/getDistance');
const lcl = require('../../locals/ru').invite;
exports.inviteLocation = {
    ask: (ctx) =>
        ctx.replyWithHTML(`${lcl.location.text.enter}`,
            Extra
                .markup((m) => m
                    .keyboard([
                        [m.locationRequestButton(`${lcl.location.buttons.sendLocation}`)],
                        [lcl.location.buttons.undo]
                    ])
                    .resize()
                    .oneTime()
                )
        ),
    get: async (ctx) => {
        const {inviteId} = ctx;
        const {latitude, longitude} = ctx.message.location;
        await Invite.updateOne({_id: inviteId}, {
            $set: {location: {lat: latitude, lon: longitude}},
            ready: true,
            endDate: Date.now() + 1000 * 60 * 30
        });

        return ctx.nextScene(true);//return ctx.scene.enter('inviteAvailable');
    },
    undo: async ctx => {
        const {inviteId} = ctx;
        await Invite.deleteOne({_id: inviteId});
        return ctx.dropScenario();
    },
    error: ctx => ctx.replyWithHTML(`${lcl.location.text.error}`, Extra
        .markup((m) => m
            .keyboard([
                [m.locationRequestButton(`${lcl.location.buttons.sendLocation}`)],
                [lcl.location.buttons.undo]
            ])
            .resize()
            .oneTime()
        ))
};
exports.inviteDescription = {
    ask: async (ctx) => {
        const {userId} = ctx;
        const invite = await new Invite({userId}).save();
        await User.updateOne({_id: userId}, {lastInvite: invite._id});
        return ctx.replyWithHTML(`${lcl.description.text.enter}`, Extra.markup(m => m
            .resize()
            .keyboard([`${lcl.description.buttons.undo}`])
            .oneTime(false)
        ));
    },
    get: async (ctx) => {
        const {inviteId} = ctx;
        let desc = ctx.getMessage(1, 200, 20);
        if (!desc)
            return ctx.replyWithHTML(lcl.description.text.toLarge);
        await Invite.updateOne({_id: inviteId}, {
            $set: {description: desc},
        });

        return ctx.sceneComplete(`${lcl.description.text.success}`, `${lcl.description.buttons.submit}`);
    },
    undo: async ctx => {
        const {inviteId} = ctx;
        await Invite.deleteOne({_id: inviteId});
        return ctx.dropScenario();
    },
    error: ctx => ctx.replyWithHTML(`${lcl.description.text.error}`)
};
exports.invitePhoto = {
    ask: ctx => ctx.sceneComplete(`${lcl.photo.text.enter}`, `${lcl.photo.buttons.submit}`),
    get: async (ctx) => {
        const {inviteId} = ctx;
        const photo = ctx.message.photo[0].file_id;
        await Invite.updateOne({_id: inviteId}, {photo});
        return ctx.replyWithHTML(`${lcl.description.text.success}`);
    },
    error: ctx => ctx.sceneComplete(`${lcl.photo.text.error}`, `${lcl.photo.buttons.submit}`)
};
exports.inviteAvailable = {
    find: async (ctx) => {
        const {userId, inviteId} = ctx;
        const {noResults, enter} = lcl.available.text;
        const invite = await Invite.findOne({_id: inviteId});
        const friends = await invite.findAround();
        const kb = [`${lcl.available.buttons.drop}`];
        if (friends.length) {
            await ctx.replyWithHTML(`${enter}`,
                Extra
                    .markup((m) => m
                        .resize()
                        .keyboard(kb)
                        .oneTime()
                    )
            );
        } else {
            await ctx.replyWithAudio(`${lcl.available.files.noResultsAudio}`, Extra
                .HTML()
                .load({caption: `${enter}\n${noResults}`})
                .markup((m) => m
                    .resize()
                    .keyboard(kb)
                    .oneTime()
                )
            );
        }
        friends.forEach(async (friend) => {
            const distance = getDistance(invite.location, friend.location);
            await shareInvite(ctx.telegram, userId, friend, distance);
            await shareInvite(ctx.telegram, friend.userId, invite, distance);
        });
    },
    agree: async (ctx) => {
        const {inviteId, userId} = ctx;
        const agreedId = ctx.callbackQuery.data;
        await Invite.updateOne({_id: agreedId}, {
            $push: {agreedInvitations: inviteId},
        });
        const userInvite = await Invite.findOne({$and: [{_id: inviteId}, {agreedInvitations: agreedId}]});
        if (userInvite) {
            const agreedInvite = await Invite.findOne({_id: agreedId}, 'userId');
            await shareInfo(ctx.telegram, userId, agreedInvite.userId);
            await shareInfo(ctx.telegram, agreedInvite.userId, userId);
        }
        return ctx.deleteMessage();
    },
    drop: async (ctx) => {
        const {inviteId} = ctx;
        await Invite.updateOne({_id: inviteId}, {
            endDate: Date.now(),
        });
        return ctx.dropScenario();
    },
    error: ctx => ctx.replyWithHTML(`${lcl.available.text.error}`,Extra.markup((m) => m
        .resize()
        .keyboard([`${lcl.available.buttons.drop}`])
        .oneTime()
    ))
};

exports.next = (ctx) => ctx.nextScene();

async function shareInfo(telegram, userId, profileId) {
    const user = await User.findOne({_id: profileId});
    if (user) {
        const {_id, firstName, userName, age, sex, description, photo, phoneNumber} = user;
        return telegram.sendPhoto(userId, photo,
            Extra
                .HTML()
                .load({
                    caption: `${
                        sex === 'm' ? '🤵' : '👩‍💼'
                        }${
                        phoneNumber ? '✅' : '❌'
                        }\n<a href = "tg://user?id=${
                        _id
                        }">${
                        firstName
                        }</a>, ${
                        age
                        } - ${
                        description
                        }\n<b>Согласен на ваше приглашение!</b>>`
                })
                .markup(m => userName ? m.inlineKeyboard(
                    [m.urlButton(`${lcl.available.buttons.getUser}`, `http://t.me/${userName}`)]
                    ) : m
                )
        );
    }
}

async function shareInvite(telegram, userId, invite, dist) {
    const {phoneNumber, firstName, age, description, sex, photo} = await invite.getUserInfo();

    let invitePhoto = invite.photo || photo;
    return telegram.sendPhoto(userId, invitePhoto,
        Extra
            .HTML()
            .load({
                caption: `📍${dist}\n${sex === 'm' ? '🤵' : '👩‍💼'}${phoneNumber ? '✅' : '❌'}\n${firstName} , ${age} - ${description}\n🎯 ${invite.description}`
            })
            .markup((m) => m.inlineKeyboard([
                m.callbackButton('❌', 'ignore'),
                m.callbackButton('❤️', invite._id),
            ])));
}
