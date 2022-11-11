const { EmbedBuilder, GuildMember, Client } = require("discord.js")
const { QuickDB } = require("quick.db")
const { welcomePlaceholder } = require("../../functions/utils/functions")
const db = new QuickDB({ filePath: "./database/autorole.sqlite" })
const welcomeDB = new QuickDB({filePath: "./database/welcome.sqlite"})

module.exports = {
    name: "guildMemberAdd",
    /**
     * 
     * @param {GuildMember} member 
     */
    async execute(member) {
        const { guild } = member

        // Welcome
        const welcome = await welcomeDB.get(guild.id)
        console.log(welcome)
        const welcomeObj = {
            welcome: await welcomePlaceholder(welcome.welcomemsg, member.user, member.guild),
            channel: await guild.channels.fetch(welcome.channel)
        }

        await welcomeObj.channel.send({content: welcomeObj.welcome})

        // Autorole
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