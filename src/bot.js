require("dotenv").config()
require("../api/api.js")
/*
If the main bot is used, use "token_main".
If the dev bot is used, use "token_dev".
*/
const { token_dev } = process.env

const { Client, Collection, GatewayIntentBits } = require("discord.js")
const fs = require("fs")

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] })
client.commands = new Collection()
client.buttons = new Collection()
client.commandArray = []

const functionFolders = fs.readdirSync("./src/functions")
for (const folder of functionFolders) {
    const functionFiles = fs
        .readdirSync(`./src/functions/${folder}`)
        .filter((file) => file.endsWith("js"))
    for (const file of functionFiles) {
        if (folder == "handlers") {
            if (file.startsWith("[NC]")) continue
            require(`./functions/${folder}/${file}`)(client)
        } else {
            require(`./functions/${folder}/${file}`)
        }
    }
}

client.handleCommands()
client.handleEvents()
client.login(token_dev)

