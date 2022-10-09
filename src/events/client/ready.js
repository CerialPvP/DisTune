const chalk = require("chalk")
const { ActivityType } = require("discord.js")

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(chalk.green(`The bot is ready! Logged into ${client.user.tag}.`))

        const presence = process.env.presence
        const nPresence = presence.replace("{servers}", client.guilds.cache.size)

        client.user.setPresence({ activities: [{ name: nPresence, type: ActivityType.Watching }] })
    },
}
