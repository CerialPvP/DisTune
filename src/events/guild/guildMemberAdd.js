const { EmbedBuilder } = require('discord.js')
const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: "./database/autorole.sqlite" })

module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const { user, guild } = member
        console.log(guild)

        const roles = await db.get(`${guild.id}_roles`)
        const roleObj = []
        for (const role in roles) {
            var pushedObj = guild.roles.cache.get(role)
            roleObj.push(pushedObj)
            console.log(pushedObj)
        }

        const logchannel = guild.channels.cache.get(await db.get(`${guild.id}_logchannel`))
        if (logchannel !== null) {
            const embed = new EmbedBuilder()
                .setColor("Yellow").setTitle("New member joined!")
                .setDescription(`**Member:** ${member}\n**Roles Given:** ${roleObj}`)
            logchannel.send({ embeds: [embed] })
        }
    }
}