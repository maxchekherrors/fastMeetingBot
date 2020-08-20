const controllers = require('./menu.controller');
const conf = require('../../locals/ru');
const Scene = require('telegraf/scenes/base');
exports.mainMenu = () => {
    const {mainMenu} = controllers;
    const menu = new Scene('mainMenu');
    menu.enter(mainMenu.send);
    menu.start(mainMenu.start);
    menu.hears(`${conf.menu.buttons.editProfile}`,  mainMenu.editProfile);
    menu.hears(`${conf.menu.buttons.createInvite}`,  mainMenu.createInvite);
    menu.hears(`${conf.menu.buttons.showProfile}`, mainMenu.showProfile);
    menu.on('message', (ctx) => ctx.scene.enter('mainMenu'));
    return menu;
};