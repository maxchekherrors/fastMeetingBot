const fs = require('fs')
const path = require('path');
const Scenes = [];

fs.readdirSync(__dirname)
    .filter(file => file.indexOf('.') !== 0)
    .forEach(
        file => {
            const scenes = require(path.join(__dirname, file));
            for (const key in scenes){
                Scenes.push(scenes[key]);
            }

        });

module.exports = Scenes;