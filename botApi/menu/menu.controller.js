const conf = require('../../locals/ru');
const Extra = require('telegraf/extra');
const User = require('../user/user.model');
exports.mainMenu = {
    start: ctx => {
        console.log(ctx.session);
        ctx.setScenario([
            'profileUpdate',
            'profileSex',
            'profileAge',
            'profileDescription',
            'profilePhoto',
            'profileContact'
        ]);
        console.log(ctx.session);
    },
    editProfile: ctx => {

    },
    createInvite:ctx=>{
        ctx.setScenario(['inviteDescription','inviteLocation','inviteAvailable']);
    },
    showProfile: async (ctx) => {
        const {userId} = ctx;
        console.log(ctx.session);
        const user = await User.findOne({_id: userId});
        const info = `<b>${
            user.fullName
            }</b>\nAge: <b>${
            user.age
            }</b>\nAbout: <b>${
            user.description
            }</b>\nVerified: ${
            user.phoneNumber ? '✅' : '❌'
            }`;
        return ctx.replyWithPhoto(user.photo, Extra.caption(info).HTML());
    },

    send: async (ctx) => {
        const buttons = conf.menu.buttons;
        const kb = [
            [buttons.createInvite],
            [buttons.showProfile, buttons.editProfile],
        ];
        ctx.sceneComplete();
        return ctx.replyWithHTML(`${conf.menu.text.enter}`,
            Extra.markup((markup) => markup
                .resize()
                .keyboard(kb)
            ));
    }
};

