/**
 * All functions will be stored here.
 */

const fs = require("fs")

module.exports = {
    loopCommands: loopCommands,
    randomNumber: randomNumber,
    booleanToTrad: booleanToTrad,
    betterJoin: betterJoin,
}

/**
 * Get all of the commands.
 * @returns The commands
 */
function loopCommands() {
    const loopCommandsObj = []

    const commandFolders = fs.readdirSync("./src/commands")
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter(file => file.endsWith(".js"))
        for (const file of commandFiles) {
            const push = `${folder};${file}`
            loopCommandsObj.push(push)
        }
    }
    return loopCommandsObj
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
    return rand
}

/**
 * Convert a boolean to a simple "Yes" or "No".
 * @param {Boolean} bool 
 * @param {Boolean} capital 
 */

function booleanToTrad(bool, capital) {
    /** @type {String} */
    let returnBool

    if (bool) returnBool = "yes"
    else if (!bool) returnBool = "no"

    // Capitilize
    if (capital) {
        const low = returnBool.toLowerCase()
        return returnBool[0].toUpperCase + low.slice(1)

    } else {return returnBool}
}

/**
 * "Joins" the object with a custom string. For example: "obj 1, obj 2"
 * @param {Object} obj The object you want to join.
 * @param {String} char The charater you want to connect the object.
 * @returns {String} The final joined object.
 */
function betterJoin(obj, char) {
    return `${obj.join(char)}`
}