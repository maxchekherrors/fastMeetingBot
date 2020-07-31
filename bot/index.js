
const Stage = require('telegraf/stage');

const Scenes = require('./scenes');
const stage = new Stage(Scenes, { ttl: 60*20 });
module.exports = function(bot){

    bot.use(stage.middleware());
};