const chalk = require("chalk")
const { Client } = require("discord.js")
const fs = require("fs")

module.exports = {
    loadCommands: loadCommands,
}

/**
 * Loads all of the commands.
 * @param {Client} client The client.
 * @param {Boolean} rl Check if you're reloading all commands.
 * @returns {Array} The commands to register.
 */
function loadCommands(client, rl) {
    if (!rl) console.log(chalk.yellowBright("Starting command handler..."))
    else if (rl) console.log(chalk.yellowBright("Reloading all commands..."))

    const t1 = Date.now()
    const commandFolders = fs.readdirSync("./src/commands")
    const { commands, commandArray } = client
    const fReturn = []
    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(`./src/commands/${folder}`)
            .filter((file) => file.endsWith(".js"))
        for (const file of commandFiles) {
            if (file.startsWith("-")) {continue}

            const command = require(`../../commands/${folder}/${file}`)
            commands.set(command.data.name, command)
            fReturn.push(command.data.toJSON())
            console.log(chalk.bgCyan(`Command ${command.data.name} registered.`))
        }
    }

    return fReturn
}