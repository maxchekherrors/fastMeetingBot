'use strict';
const Extra = require('telegraf/extra');
const User = require('./user.model');
const lcl = require('../../locals/ru').profile;

exports.profileSex = {
	ask: ctx => ctx.replyWithHTML(`${lcl.sex.text.enter}`, Extra.markup(m => m
		.resize()
		.keyboard([
			[lcl.sex.buttons.female, lcl.sex.buttons.male]
		]
		)
	))
	,
	get: async ctx => {
		const {userId} = ctx;
		const sex = ctx.message.text;
		let userSex = 'm';
		let answ = '';
		switch (sex) {
		case lcl.sex.buttons.male:
			answ = lcl.sex.text.successM;
			userSex = 'm';
			break;
		case lcl.sex.buttons.female:
			answ = lcl.sex.text.successF;
			userSex = 'f';
			break;
		default:
			return ctx.replyWithHTML(`${lcl.sex.text.error}`, Extra.markup(m => m
				.resize()
				.keyboard([
					[lcl.sex.buttons.female, lcl.sex.buttons.male]
				]
				)
			));
		}
		await User.updateOne({_id: userId}, {
			$set: {sex: userSex}
		});
		return ctx.sceneComplete(`${answ}`, `${lcl.sex.buttons.submit}`);

	},
	error: ctx => ctx.replyWithHTML(`${lcl.sex.text.error}`, Extra.markup(m => m
		.resize()
		.keyboard([
			[lcl.sex.buttons.female, lcl.sex.buttons.male]
		]
		)
	))
};
exports.profilePhoto = {
	ask: ctx => ctx
		.replyWithHTML(`${lcl.photo.text.enter}`,
			Extra.markup(m => m.removeKeyboard())
		)
	,
	get: async (ctx) => {
		const {userId} = ctx;
		const photo = ctx.message.photo[0].file_id;
		await User.updateOne({_id: userId}, {
			$set: {photo},
		});
		return ctx.sceneComplete(`${lcl.photo.text.success}`, `${lcl.photo.buttons.submit}`);
	},
	error: ctx => ctx
		.replyWithHTML(`${lcl.sex.text.error}`)
};
exports.profileAge = {
	ask: ctx => ctx
		.replyWithHTML(`${lcl.age.text.enter}`, Extra.markup(m => m.removeKeyboard())),
	get: async (ctx) => {
		const {userId} = ctx;
		const age = ctx.getNumber(10, 60);
		if (!age)
			return ctx.replyWithHTML(`${lcl.age.text.notInRange}`);

		await User.updateOne({_id: userId}, {age:Math.floor(age)});
		return ctx.sceneComplete(`${lcl.age.text.success}`, `${lcl.age.buttons.submit}`);
	},

	error: ctx => ctx
		.replyWithHTML(`${lcl.age.text.error}`)
};
exports.profileContact = {
	ask: async (ctx) => {
		return ctx.replyWithHTML(`${lcl.contact.text.enter}`,
			Extra.markup((markup) => markup.resize()
				.keyboard([
					[markup.contactRequestButton(`${lcl.contact.buttons.send}`)],
					[`${lcl.contact.buttons.refuse}`],
				]).oneTime()));
	},
	skip: ctx => ctx.nextScene(true),
	get: async (ctx) => {
		const {userId} = ctx;
		const phone = ctx.message.contact.phone_number;
		await User.updateOne({_id: userId}, {$set: {phoneNumber: phone}});
		return ctx.nextScene(true);
	},
	error: ctx => ctx
		.replyWithHTML(`${lcl.contact.text.error}`)
};
exports.profileDescription = {
	ask: ctx => ctx
		.replyWithHTML(`${lcl.description.text.enter}`,
			Extra.markup(m => m.removeKeyboard())
		),
	get: async (ctx) => {
		const {userId} = ctx;
		const desc = ctx.getMessage(1, 200, 20);
		if (!desc)
			return ctx.replyWithHTML(`${lcl.description.text.toLarge}`);
		await User.updateOne({_id: userId}, {description: desc});
		return ctx.sceneComplete(`${lcl.description.text.success}`, `${lcl.description.buttons.submit}`);
	},
	error: ctx => ctx
		.replyWithHTML(`${lcl.description.text.error}`)
};
exports.profileUpdate = {
	do: async (ctx) => {
		const {from} = ctx.message;
		let answ = '';
		const user = {
			_id: from.id,
			firstName: from.first_name,
			lastName: from.last_name,
			userName: from.username,
		};
		if (!await User.exists({_id: from.id})) {
			await new User(user).save();
			answ = lcl.create.text.enter;
		} else {
			await User.updateOne({_id: from.id}, {user});
			answ = lcl.create.text.reenter;
		}
		await ctx.replyWithHTML('...');
		return ctx.sceneComplete(`${answ}`, `${lcl.create.buttons.submit}`);

	}
};
exports.profileEdit = {
	ask: ctx => {
		const {contact, description, sex, age, photo, menu} = lcl.edit.buttons;
		const {enter} = lcl.edit.text;
		const kb = [
			[contact, photo],
			[description, age],
			[menu, sex]
		];
		ctx.sceneComplete(`${enter}`, kb);
	},
	get: ctx => {
		const {contact, description, sex, age, photo, menu} = lcl.edit.buttons;
		const mes = ctx.message.text;
		switch (mes) {
		case contact:
			return ctx.scene.enter('profileContact');
		case description:
			return ctx.scene.enter('profileDescription');
		case sex:
			return ctx.scene.enter('profileSex');
		case age:
			return ctx.scene.enter('profileAge');
		case photo:
			return ctx.scene.enter('profilePhoto');
		case menu:
			return ctx.nextScene(true);
		default:
			return ctx.scene.reenter();
		}
	},
	error: ctx => ctx.scene.reenter()


};
exports.next = ctx => ctx.nextScene();




