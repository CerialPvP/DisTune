const { EmbedBuilder, Embed } = require("discord.js")
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
            if (!pushedObj) {
                db.delete(`${guild.id}_logchannel`)
                db.delete(`${guild.id}_roles`)
            }
            roleObj.push(pushedObj)
        }

        await member.roles.add(roleObj)
    }
}