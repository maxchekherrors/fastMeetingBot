//const Markup = require('telegraf/markup');
const Invite = require('./invite.model');
const User = require('../user/user.model');
const Extra = require('telegraf/extra');
const getDistance = require('../../utils/getDistance');
const conf = require('../../locals/ru').invite;
exports.inviteLocation = {
	ask:(ctx) =>
		ctx.reply(`${conf.location.text.enter}`,
			Extra
				.HTML()
				.markup((m) => m
					.keyboard([
						[m.locationRequestButton(`${conf.location.buttons.sendLocation}`)],
						[conf.location.buttons.undo]
					])
					.resize()
					.oneTime()
				)
		),
	get:async (ctx) => {
		const {inviteId} = ctx;
		const {latitude, longitude} = ctx.message.location;
		await Invite.updateOne({_id: inviteId}, {
			$set: {location: {lat: latitude, lon: longitude}},
			ready: true,
		});

		return ctx.nextScene(true);//return ctx.scene.enter('inviteAvailable');
	},
	undo:async ctx => {
		const {inviteId} = ctx;
		await Invite.deleteOne({_id: inviteId});
		return ctx.dropScenario();
	},
	error:ctx=>ctx.replyWithHTML(`${conf.location.text.error}`)
};
exports.inviteDescription = {
	ask:async (ctx) => {
		const {userId} = ctx;
		const invite = await new Invite({userId}).save();
		await User.updateOne({_id: userId}, {lastInvite: invite._id});
		return ctx.replyWithHTML(`${conf.description.text.enter}`, Extra.markup(m => m.removeKeyboard()));
	},
	get:async (ctx) => {
		const {inviteId} = ctx;
		let desc = ctx.message.text;
		if (desc.length > 300) {
			desc = desc.slice(0, 300);
			desc += '...';
			await ctx.replyWithHTML(`${conf.description.text.toLarge}`);
		}
		await Invite.updateOne({_id: inviteId}, {
			$set: {description: desc},
		});

		return ctx.sceneComplete(`${conf.description.text.preSuccess}`,`${conf.description.buttons.submit}`);
	},
	getPhoto:async (ctx) => {
		const {inviteId} = ctx;
		const photo = ctx.message.photo[0].file_id;
		await Invite.updateOne({_id: inviteId}, {photo});
		return ctx.replyWithHTML(`${conf.description.text.success}`);
	},
	error:ctx=>ctx.replyWithHTML(`${conf.description.text.error}`)
};
exports.inviteAvailable = {
	find:async (ctx) => {
		const {userId, inviteId} = ctx;
		await ctx.replyWithHTML(`${conf.available.text.enter}`,
			Extra
				.HTML()
				.markup((markup) => markup.resize()
					.keyboard([
						[`${conf.available.buttons.drop}`],
					]).oneTime()));
		const invite = await Invite.findOne({_id: inviteId});
		const friends = await invite.findAround();
		if (friends.length === 0) {
			return ctx.replyWithHTML(`${conf.available.text.noResults}`);
		}
		console.log(friends.length);
		friends.forEach(async (friend) => {
			const distance = getDistance(invite.location, friend.location);
			await shareInvite(ctx.telegram, userId, friend, distance);
			await shareInvite(ctx.telegram, friend.userId, invite, distance);
		});
	},
	agree:async (ctx) => {
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
	drop:async (ctx) => {
		const {inviteId} = ctx;
		await Invite.updateOne({_id: inviteId}, {
			endDate: Date.now(),
		});
		return ctx.dropScenario();
	},
	error:ctx=>ctx.replyWithHTML(`${conf.available.text.error}`)
};

exports.next = (ctx) => ctx.nextScene();

async function shareInfo(telegram, userId, profileId) {
	const user = await User.findOne({_id: profileId});
	const {photo} = user;
	if (user) {
		return telegram.sendPhoto(userId, photo,
			Extra
				.HTML()
				.load({
					caption: `<a href = "tg://user?id=${user._id}">${user.firstName}</a>, ${user.age} - ${user.description}\nAgreed in your invite!`
				})
				.markup(m => m.inlineKeyboard(
					[m.urlButton(`${conf.available.buttons.getUser}`, `tg://user?id=${user._id}`)]
				)
				)
		);
	}
}

async function shareInvite(telegram, userId, invite, dis) {
	const info = await invite.getFullDescription();
	let {photo} = invite;
	if (photo.length === 0) {
		const user = await User.findOne({_id: invite.userId}, 'photo');
		photo = user.photo;
	}
	return telegram.sendPhoto(userId, photo,
		Extra.load({caption: `📍${dis}\n ${info}`})
			.HTML()
			.markup((m) => m.inlineKeyboard([
				m.callbackButton('❌', 'ignore'),
				m.callbackButton('❤️', invite._id),
			])));
}
