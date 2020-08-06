const fs = require('fs');
const path = require('path');
const Stage = require('telegraf/stage');

const Scenes = [];
fs.readdirSync(__dirname)
	.filter((file) => file.indexOf('.') !== 0)
	.forEach(
		(file) => {
			const scenes = require(path.join(__dirname, file));
			for (const key in scenes) {
				Scenes.push(scenes[key]);
			}
		},
	);

const stage = new Stage(Scenes, { default: 'mainMenu' });
module.exports = function (bot) {
	bot.use(stage.middleware());
};
