const Extra = require('telegraf/extra');
const conf = require('../../locals/ru').profile;
const User = require('./user.model');

exports.profileSex = {
	ask: ctx => {
		return ctx.replyWithHTML(`${conf.sex.text.enter}`, Extra.markup(m => m
			.resize()
			.keyboard([
				[conf.sex.buttons.female, conf.sex.buttons.male]
			]
			)
		));
	},
	get: async ctx => {
		const {userId} = ctx;
		const sex = ctx.message.text;
		let userSex = 'm';
		let answ = '';
		switch (sex) {
		case conf.sex.buttons.male:
			answ = conf.sex.text.successM;
			userSex = 'm';
			break;
		case conf.sex.buttons.female:
			answ = conf.sex.text.successF;
			userSex = 'f';
			break;
		default:
			return ctx.replyWithHTML(`${conf.sex.text.error}`);
		}
		await User.updateOne({_id: userId}, {
			$set: {sex: userSex}
		});
		return ctx.sceneComplete(`${answ}`, `${conf.sex.buttons.submit}`);

	},
	error: ctx => ctx
		.replyWithHTML(`${conf.sex.text.error}`)
};
exports.profilePhoto = {
	ask: ctx => ctx
		.replyWithHTML(`${conf.photo.text.enter}`,
			Extra.markup(m => m.removeKeyboard())
		)
	,
	get: async (ctx) => {
		const {userId} = ctx;
		const photo = ctx.message.photo[0].file_id;
		await User.updateOne({_id: userId}, {
			$set: {photo},
		});
		return ctx.sceneComplete(`${conf.photo.text.success}`, `${conf.photo.buttons.submit}`);
	},
	error: ctx => ctx
		.replyWithHTML(`${conf.sex.text.error}`, Extra.markup(m => m.removeKeyboard()))
};
exports.profileAge = {
	ask: ctx => ctx
		.replyWithHTML(`${conf.age.text.enter}`, Extra.markup(m => m.removeKeyboard())),
	get: async (ctx) => {
		const {userId} = ctx;
		const age = ctx.getNumber(10,60);
		if (!age) {
			return ctx.replyWithHTML(`${conf.age.text.notInRange}`);
		}
		await User.updateOne({_id: userId}, {age});
		return ctx.sceneComplete(`${conf.age.text.success}`, `${conf.age.buttons.submit}`);
	},

	error: ctx => ctx
		.replyWithHTML(`${conf.age.text.error}`)
};
exports.profileContact = {
	ask: async (ctx) => {
		return ctx.replyWithHTML(`${conf.contact.text.enter}`,
			Extra.markup((markup) => markup.resize()
				.keyboard([
					[markup.contactRequestButton(`${conf.contact.buttons.send}`)],
					[`${conf.contact.buttons.refuse}`],
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
		.replyWithHTML(`${conf.contact.text.error}`)
};
exports.profileDescription = {
	ask: ctx => ctx
		.replyWithHTML(`${conf.description.text.enter}`,
			Extra.markup(m => m.removeKeyboard())
		),
	get: async (ctx) => {
		const {userId} = ctx;
		const desc = ctx.getMessage(1,200,20);
		if (!desc)
			return ctx.replyWithHTML(`${conf.description.text.toLarge}`);
		await User.updateOne({_id: userId}, {description: desc});
		return ctx.sceneComplete(`${conf.description.text.success}`, `${conf.description.buttons.submit}`);
	},
	error: ctx => ctx
		.replyWithHTML(`${conf.description.text.error}`)
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
			answ = conf.create.text.enter;
		} else {
			await User.updateOne({_id: from.id}, {user});
			answ = conf.create.text.reenter;
		}
		await ctx.replyWithHTML('...');
		return ctx.sceneComplete(`${answ}`, `${conf.create.buttons.submit}`);

	}
};
exports.profileEdit = {
	ask: ctx => {
		const {contact, description, sex, age, photo} = conf.edit.buttons;
		const{enter} = conf.edit.text;
		const kb = [
			[contact],
			[description, photo],
			[age, sex]
		];
		ctx.sceneComplete(`${enter}`,kb);
	},
	get: ctx=>{
		const {contact, description, sex, age, photo} = conf.edit.buttons;
		const{error} = conf.edit.text;
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
		default:
			return ctx.replyWithHTML(`${error}`);
		}
	},
	error:ctx=> ctx.replyWithHTML(`${conf.edit.text.error}`)

};
exports.next = ctx => ctx.nextScene();




