const chalk = require("chalk")
const { ActivityType } = require("discord.js")

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(chalk.green(`The bot is ready! Logged into ${client.user.tag}.`))
        if (!process.env.watermark_text) console.log(chalk.gray("------------------------------\n")+chalk.red("If you are planning to distribute your bot with this source code, then do not do it.\n")+chalk.red("The DisTune team has worked on this bot for a long time, and using our code for your public bot is not cool.\n"+chalk.red("Instead, consider learning more about coding and make your original bot.\n"+chalk.red.bold("Anyone can report your bot to DisTune if it's copying our code. Beware!\n")+chalk.yellow("- Cerial and the DisTune team\n")+chalk.gray("------------------------------\n"))))

        const presence = process.env.presence
        const nPresence = presence.replace("{servers}", client.guilds.cache.size)

        client.user.setPresence({ activities: [{ name: nPresence, type: ActivityType.Watching }] })
    },
}
