const Extra = require('telegraf/extra');
module.exports = def => (ctx, next) => {

    if (!ctx.session.scenario)
        ctx.session.scenario = {queue: [], complete: false};
    ctx.setScenario = queue => {
        ctx.session.scenario.queue = queue;
        return ctx.nextScene(true);
    };
    ctx.dropScenario = () => {
        ctx.session.scenario = {queue: [], complete: false};
        return ctx.scene.enter(`${def}`);
    };
    ctx.nextScene = (finish) => {
        if (!ctx.session.scenario.complete && !finish) return;
        const scene = ctx.session.scenario.queue.shift() || def;
        ctx.session.scenario.complete = false;
        return ctx.scene.enter(`${scene}`);
    };
    ctx.sceneComplete = (msg, buttons) => {
        ctx.session.scenario.complete = true;
        return ctx.replyWithHTML(`${msg}`, Extra.markup(m => m
            .resize()
            .keyboard(buttons instanceof Array ? buttons : [buttons]))
        );

    };

    return next();
};