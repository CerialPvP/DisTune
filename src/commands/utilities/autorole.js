/**
 * When a member joins a server, they will receive roles the
 * server owners set up. This is very useful if you can't
 * bother with giving roles manually to people.
 */

const { SlashCommandBuilder, SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js')

const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: `./database/autorole.sqlite` })

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autorole")
        .setDescription("Gives a role automatically to new members.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("View general information about Autorole, and also setup information.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("setup")
                .setDescription("Set up Autorole in your server.")
                .addRoleOption(option =>
                    option.setName("role")
                        .setDescription("The role you want to use for Autorole. You can add more later with /autorole addrole.")
                        .setRequired(true),
                )
                .addChannelOption(option =>
                    option.setName("logchannel")
                        .setDescription("This will be the channel I will log any new members to.")
                        .setRequired(false),
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("Deletes the Autorole data.")
        ),
    
    async execute(interaction, client) {
        subcmd = interaction.options.getSubcommand()


        if (subcmd == "info") {
            const roles = await db.get(`${interaction.guild.id}_roles`)
            const channel = await db.get(`${interaction.guild.id}_logchannel`)
            
            const roleArray = []
            for (let role in roles) {
                let pushRole = interaction.guild.roles.cache.find(r => r.id === role)
                console.log(pushRole)
                roleArray.push(pushRole)
            }
            
            interaction.reply(`${roleArray} | ${roles}`)
            const embed = new EmbedBuilder()
                .setColor("Purple").setTitle("Autorole - Information")
                .setDescription("Do you want to give any new members who join your server roles automatically?\nWell, you can with Autorole!\nAutorole automatically gives roles you tell me to give to any new member who joins.\nMake your **new members** feel honoured today.")
                .addFields(
                    { name: "Roles", value: `q${(roleArray.length >= 0)?roleArray:"No roles have been set up yet."}` },
                    { name: "Logging Channel", value: `${(channel !== null)?interaction.guild.channels.cache.find(c => c.id === channel):"No log channel has been set."}` },
                )
            
            setTimeout(() => {
                interaction.followUp({ embeds: [embed] })
            }, 1500);
            
        } else if (subcmd == "setup") {
            const role = interaction.options.getRole("role")
            const channel = interaction.options.getChannel("logchannel")

            db.push(`${interaction.guild.id}_roles`, role.id)

            if (channel !== null) {db.set(`${interaction.guild.id}_logchannel`, channel.id);const opchannelmsg = `\n**Logging channel (Optional):** ${channel}`}

            const embed = new EmbedBuilder()
                .setColor("Green").setTitle("Autorole - Setup Complete")
                .setDescription(`**TIP: Do you want to give more than 1 role to a new member? Use \`/autorole addrole <role>\` to add a role to Autorole.**\nThe setup has been completed.\n**Automated role:** ${role}`)//${(channel !== null)?opchannelmsg:""}`)
            interaction.reply({ embeds: [embed] })
        } else if (subcmd == "delete") {
            db.delete(`${interaction.guild.id}_roles`)
            db.delete(`${interaction.guild.id}_logchannel`)

            const embed = new EmbedBuilder()
                .setColor("Green").setTitle("Autorole - Data Deleted.")
                .setDescription("This server's Autorole data has been deleted.\nWhen a new member joins, that new member will not receive any role.\nIf you want to set this up again, you may do `/autorole setup`.")
            
            interaction.reply({embeds: [embed]})
        }
    }
}