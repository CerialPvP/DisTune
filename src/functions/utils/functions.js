/**
 * All functions will be stored here.
 */

const fs = require('fs')

module.exports = {
    loopCommands: loopCommands,
    randomNumber: randomNumber
}

/**
 * Get all of the commands.
 * @returns The commands
 */
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

/**
 * Gets a random number from 1 to a custom amount.
 * @param {Number} min The lowest number you want to generate.
 * @param {Number} max The highest number you want to generate.
 * @returns {Number} The random number.
 */

function randomNumber(min, max) {
    const rand = Math.floor(Math.random()*(max-min+1))+min
    console.log(rand)
    return rand;
}