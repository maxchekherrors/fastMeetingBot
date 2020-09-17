'use strict';
const Extra = require('telegraf/extra');
const def = process.env.DEFAULT_SCENE||'mainMenu';
module.exports =  (ctx, next) => {

	if (!ctx.session.__scenario)
		ctx.session.__scenario = {queue: [], complete: false};
	ctx.setScenario = queue => {


		ctx.session.__scenario.queue = queue;

		return ctx.nextScene(true);
	};
	ctx.dropScenario = () => {
		ctx.session.__scenario = {queue: [], complete: false};
		return ctx.scene.enter(`${def}`);
	};
	ctx.nextScene = (finish) => {
		if (!ctx.session.__scenario.complete && !finish) return;
		const scene = ctx.session.__scenario.queue.shift() || def;
		ctx.session.__scenario.complete = false;
		return ctx.scene.enter(`${scene}`);
	};
	ctx.sceneComplete = (msg, buttons) => {
		ctx.session.__scenario.complete = true;
		return ctx.replyWithHTML(`${msg}`, Extra.markup(m => m
			.resize()
			.keyboard(buttons instanceof Array ? buttons : [buttons]))
		);

	};
	return next();
};