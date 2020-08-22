const conf = require('../../locals/ru');
const Extra = require('telegraf/extra');
const User = require('../user/user.model');

exports.mainMenu = {
	start: ctx => {
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
	editProfile: ctx => ctx.scene.enter('profileEdit'),
	createInvite:ctx=>ctx
        .setScenario(['inviteDescription','inviteLocation','inviteAvailable']),

	showProfile: async (ctx) => {
		const {userId} = ctx;
		const {male, female} = conf.profile.sex.buttons;
		const {description,contact,age,sex} = conf.profile.edit.buttons;
		const user = await User.findOne({_id: userId});
		const info = `${
            user.fullName 
		}<b>\n${sex}:</b> ${
		    user.sex ==='m'?male:female
		}\n<b>${age}: </b>${
			user.age
		}<b>\n${description}: </b>${
			user.description
		}<b>\n${contact}: </b>${
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
		return ctx.sceneComplete(`${conf.menu.text.enter}`,kb);
	}
};

