'use strict';
const lcl = require('../../locals/ru');
const {bot:config} = require('../../config');
const Extra = require('telegraf/extra');
const User = require('../user/user.model');
const Invite = require('../invite/invite.model');
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

	},
	editProfile: ctx => ctx.scene.enter('profileEdit'),
	createInvite: async ctx=>{
		const {userId,inviteId} = ctx;
		const user = await User.findOne({_id:userId});
		if(!user||!user.isComplete())
			return ctx.replyWithHTML(`${lcl.menu.text.userError}`);
		const invite = await Invite.findOne({_id:inviteId});
		if(invite&&Date.now()-invite.startDate<config.inviteInterval)
			return ctx.replyWithHTML(`${lcl.menu.text.inviteError}`);
		return ctx.setScenario(['inviteDescription','invitePhoto','inviteLocation','inviteAvailable']);
	},

	showProfile: async (ctx) => {
		const {userId} = ctx;
		const {male, female} = lcl.profile.sex.buttons;
		const {description,contact,age,sex} = lcl.profile.edit.buttons;
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
		}\n<i>${user.faces?'':'‼️Я не вижу твоего лица. . .'}</i>`;
		return ctx.replyWithPhoto(user.photo, Extra.caption(info).HTML());
	},

	send: async (ctx) => {
		const buttons = lcl.menu.buttons;
		const kb = [
			[buttons.createInvite],
			[buttons.showProfile, buttons.editProfile],
		];
		return ctx.sceneComplete(`${lcl.menu.text.enter}`,kb);
	}
};

