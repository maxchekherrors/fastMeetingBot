const Extra = require('telegraf/extra');
const conf = require('../../locals/ru').profile;

//const Markup = require('telegraf/markup');
const User = require('./user.model');

exports.createOrUpdate = async (ctx) => {
	const {from} = ctx.message;
	const user = {
		_id: from.id,
		firstName: from.first_name,
		lastName: from.last_name,
		userName: from.username,
	};
	if (!await User.exists({_id: from.id})) {
		await new User(user).save();
		await ctx.reply(`${conf.create.text.enter}`);
	} else {
		await User.updateOne({_id: from.id}, {user});
		await ctx.replyWithHTML(`${conf.create.text.enter}`, Extra.markup(m => m.removeKeyboard()));
	}

	await ctx.scene.enter('profileSex');
};
exports.menu = async (ctx) => {
	const buttons = conf.menu.buttons;
	const kb = [
		[buttons.createInvite],
		[buttons.showProfile, buttons.editProfile],
	];
	if (!ctx.verifide && !ctx.message.contact) kb[0].push(buttons.setContact);
	return ctx.replyWithHTML(`${conf.menu.text.enter}`,
		Extra.markup((markup) => markup
			.resize()
			.keyboard(kb)
			//.oneTime()
		));
};
exports.getAge = async (ctx) => {
	const {userId} = ctx;
	const age = Number(ctx.message.text);

	if (!age || age < 5 || age > 90) {
		return ctx.replyWithHTML(`${conf.age.text.notInRange}`);

	} else {
		await User.updateOne({_id: userId}, {age});
		await ctx.replyWithHTML(`${conf.age.text.success}`);
		return ctx.scene.enter('profileDescription');
	}
};
exports.askProfileSex = ctx => {
	return ctx.replyWithHTML(`${conf.sex.text.enter}`, Extra.markup(m => m
		.resize()
		.keyboard([
			[conf.sex.buttons.female, conf.sex.buttons.male]
		]
		)
	));
};
exports.getProfileSex = async ctx => {
	const {userId} = ctx;
	const sex = ctx.message.text;
	let userSex = 'm';
	switch (sex) {
	case conf.sex.buttons.male:
		await ctx.replyWithHTML(`${conf.sex.text.successM}`, Extra.markup(m => m.removeKeyboard()));
		break;
	case conf.sex.buttons.female:
		await ctx.replyWithHTML(`${conf.sex.text.successF}`, Extra.markup(m => m.removeKeyboard()));
		userSex = 'f';
		break;
	default:
		return ctx.replyWithHTML(`${conf.sex.text.error}`);
	}
	await User.updateOne({_id: userId},{
		$set:{sex:userSex}
	});
	return ctx.scene.enter('profileAge');
};
exports.getProfilePhoto = async (ctx) => {
	const {userId} = ctx;
	const photo = ctx.message.photo[0].file_id;
	await User.updateOne({_id: userId}, {
		$set: {photo},
	});
	await ctx.replyWithHTML(`${conf.photo.text.success}`);
	return ctx.verifide ?
		ctx.scene.enter('mainMenu') :
		ctx.scene.enter('profileContact');
};
exports.getDescription = async (ctx) => {
	const {userId} = ctx;
	let answ = conf.description.text.success;
	let desc = ctx.message.text;
	if (desc.length > 300) {
		desc = desc.slice(0, 300);
		desc += '...';
		answ = conf.description.text.toLarge;
	}
	await User.updateOne({_id: userId}, {description: desc});
	return ctx.replyWithHTML(`${answ}`,
		Extra.markup(m => m
			.resize()
			.keyboard([
				[`${conf.description.buttons.submit}`],
			])
			.oneTime()
		));
};

exports.askContact = async (ctx) => {
	return ctx.replyWithHTML(`${conf.contact.text.enter}`,
		Extra.markup((markup) => markup.resize()
			.keyboard([
				[markup.contactRequestButton(`${conf.contact.buttons.send}`)],
				[`${conf.contact.buttons.refuse}`],
			]).oneTime()));
};
exports.getContact = async (ctx) => {
	const {userId} = ctx;
	const phone = ctx.message.contact.phone_number;
	await User.updateOne({_id: userId}, {$set: {phoneNumber: phone}});
	await ctx.replyWithHTML(`${conf.contact.text.success}`);
	return ctx.scene.enter('mainMenu');
};
exports.showProfile = async (ctx) => {
	const {userId} = ctx;
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
};
