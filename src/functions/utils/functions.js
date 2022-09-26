/**
 * All functions will be stored here.
 */

const fs = require('fs')

module.exports = {
    loopCommands: loopCommands,
}

function loopCommands() {
    const loopCommandsObj = [];

    const commandFolders = fs.readdirSync("./src/commands");
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith('.js'))
        for (const file of commandFiles) {
            const push = `${folder};${file}`
            loopCommandsObj.push(push)
        }
    }
    return loopCommandsObj;
}