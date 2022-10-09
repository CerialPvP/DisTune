const { EmbedBuilder } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB({ filePath: "./database/autorole.sqlite" })

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const { guild } = member

        const roles = await db.get(`${guild.id}_roles`)
        const roleObj = []
        for (const role in roles) {
            var pushedObj = guild.roles.cache.get(roles[role])
            roleObj.push(pushedObj)
        }

        await member.roles.add(roleObj)

        const getLogChannel = await db.get(`${guild.id}_logchannel`)
        const logchannel = guild.channels.cache.get(getLogChannel)
        if (logchannel) {
            const embed = new EmbedBuilder()
                .setColor("Yellow").setTitle("New member joined!")
                .setDescription(`**Member:** ${member}\n**Roles Given:** ${roleObj}`)
            logchannel.send({ embeds: [embed] })
        }
    }
}