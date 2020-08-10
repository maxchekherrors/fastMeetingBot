const Extra = require('telegraf/extra');
//const Markup = require('telegraf/markup');
const User = require('./user.model');

exports.createOrUpdate = async (ctx) => {
	const { from } = ctx.message;
	const user = {
		_id: from.id,
		firstName: from.first_name,
		lastName: from.last_name,
		userName: from.username,
	};
	if (!await User.exists({ _id: from.id })) {
		await new User(user).save();
		await ctx.reply(`Welcome to the club ${user.firstName}`);
	} else {
		await User.updateOne({ _id: from.id }, { user });
		await ctx.replyWithHTML(`Nice to see you again ${user.firstName}`);
	}

	await ctx.scene.enter('profileAge');
};
exports.menu = async (ctx) => {
	const kb = [
		['Create invite'],
		['Show profile', 'Edit profile'],
	];
	if(!ctx.verifide&&!ctx.message.contact)kb[0].push( 'Share phone');
	return ctx.replyWithHTML('<b>Menu</b>',
		Extra.markup((markup) => markup.resize()
			.keyboard(kb)
			.oneTime()

		));
};
exports.getAge = async (ctx) => {
	const { userId } = ctx;
	const age = Number(ctx.message.text);

	if (!age || age < 5 || age > 90) {
		await ctx.replyWithHTML('Is not your age!!!');
		return  ctx.scene.reenter();
	} else {
		await User.updateOne({ _id: userId }, { age });
		await ctx.replyWithHTML('OK, cool');
		return ctx.scene.enter('profileDescription');
	}
};
exports.getProfilePhoto = async (ctx) => {
	const { userId } = ctx;
	const photo = ctx.message.photo[0].file_id;
	await User.updateOne({ _id: userId }, {
		$set: { photo },
	});
	await ctx.replyWithHTML('Ouu, have a nice dickkkk, respect!');
	return ctx.verifide?
		ctx.scene.enter('mainMenu'):
		ctx.scene.enter('profileContact');
};
exports.getDescription = async (ctx) => {
	const { userId } = ctx;
	const desc = ctx.message.text;
	await User.updateOne({ _id: userId }, { description: desc });

	return ctx.scene.enter('profilePhoto');
};
exports.askContact = async (ctx) => {
	return ctx.replyWithHTML('Give me your phone, I keep it save, i promise)',
		Extra.markup((markup) => markup.resize()
			.keyboard([
				[markup.contactRequestButton('Send contact')],
				['NO'],
			]).oneTime()));
};
exports.getContact = async (ctx) => {
	const { userId } = ctx;
	const phone = ctx.message.contact.phone_number;
	await User.updateOne({ _id: userId }, { $set: { phoneNumber: phone } });
	await ctx.replyWithHTML('ouuuuu, all sexy chiks will call you!) bro');
	return ctx.scene.enter('mainMenu');
};
exports.showProfile = async (ctx) => {
	const { userId } = ctx;
	const user = await User.findOne({ _id: userId });
	return ctx.replyWithPhoto(user.photo,
		Extra.caption(`*${user.fullName}*\n_Age:_ *${user.age}*\n_About:_ *${user.description}*\n_Account status:_ *${user.phoneNumber ? 'verified' : 'unverified'}*`).HTML());
};
