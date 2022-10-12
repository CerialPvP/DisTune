const { EmbedBuilder, Embed } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB({ filePath: "./database/autorole.sqlite" })


module.exports = {
    name: "guildMemberAdd",
    async execute(member) {
        const { guild } = member

        const getLogChannel = await db.get(`${guild.id}_logchannel`)
        const logchannel = guild.channels.cache.get(getLogChannel)
        const roles = await db.get(`${guild.id}_roles`)
        const roleObj = []
        for (const role in roles) {
            var pushedObj = guild.roles.cache.get(roles[role])
            if (!pushedObj) {
                db.delete(`${guild.id}_logchannel`)
                db.delete(`${guild.id}_roles`)
                if (logchannel) {
                    const errEmbed = new EmbedBuilder()
                        .setColor("Red").setTitle("Autorole - System Deleted")
                        .setDescription("The role which is set in the autorole has been deleted.\nBecause of that, AutoRole has been removed from your server.\nYou can set it up again anytime with `/autorole setup`.")
                    return logchannel.send({embeds: [errEmbed]})
                }
            }
            roleObj.push(pushedObj)
        }

        await member.roles.add(roleObj)

        if (logchannel) {
            const embed = new EmbedBuilder()
                .setColor("Yellow").setTitle("New member joined!")
                .setDescription(`**Member:** ${member}\n**Roles Given:** ${roleObj}`)
            logchannel.send({ embeds: [embed] })
        }
    }
}