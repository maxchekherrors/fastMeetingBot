
const Stage = require('telegraf/stage');
const Scenes = require('./scenes');
const stage = new Stage(Scenes, {default:'mainMenu'});
module.exports = function (bot) {
    bot.use(stage.middleware());

};