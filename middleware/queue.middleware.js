module.exports = def => (ctx, next) => {
    console.log(ctx.session);
    ctx.setScenario = queue => {
        ctx.session.scenario = {queue, complete: false};
        ctx.sceneComplete();
        ctx.nextScene();
    };

    ctx.nextScene = () => {
        if(!ctx.session.scenario||!ctx.session.scenario.complete)return;
        const scene = ctx.session.scenario.queue.shift() || def;
        ctx.session.scenario.complete = false;
        return ctx.scene.enter(`${scene}`);
    };
    ctx.sceneComplete = ()=>{
        if(ctx.session.scenario)
        ctx.session.scenario.complete = true;
    };

    return next();
};