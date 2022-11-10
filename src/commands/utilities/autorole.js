/**
 * When a member joins a server, they will receive roles the
 * server owners set up. This is very useful if you can"t
 * bother with giving roles manually to people.
 */

const { SlashCommandBuilder, SlashCommandSubcommandBuilder, EmbedBuilder, Embed, PermissionFlagsBits } = require("discord.js")

const { QuickDB } = require("quick.db")
const db = new QuickDB({ filePath: "./database/autorole.sqlite" })

// Comamnd name & description
var name = "autorole"
var desc = "Gives a role automatically to new members."

module.exports = {
    name: name,
    description: desc,
    permission: PermissionFlagsBits.Administrator,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(desc)
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
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete")
                .setDescription("Deletes the Autorole data.")
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("addrole")
                .setDescription("Add another role to Autorole.")
                .addRoleOption(option => option.setName("role").setDescription("The role you want to add.").setRequired(true))
        )
        .addSubcommand(subcommand => 
            subcommand
                .setName("removerole")
                .setDescription("Remove a role from Autorole.")
                .addRoleOption(option => option.setName("role").setDescription("The role you want to add.").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("test")
                .setDescription("Test if the autorole works.")
        ),
    
    async execute(interaction, client) {

        subcmd = interaction.options.getSubcommand()
        const r = await db.get(`${interaction.guild.id}_roles`)
        if (!r && subcmd !== "setup") {
            const embed = new EmbedBuilder()
                .setColor("Red").setTitle("No Autorole set up!")
                .setDescription("The Autorole in this server has not been set up yet.\nTo set it up, do `/autorole setup`.")
            return await interaction.reply({embeds: [embed], ephemeral: true})
        }


        if (subcmd == "info") {
            const roles = await db.get(`${interaction.guild.id}_roles`)
            
            const roleArray = []
            for (let loopRole in roles) {
                let pushRole = interaction.guild.roles.cache.get(roles[loopRole])
                roleArray.push(pushRole)
            }
            
            let roleCond = false
            if (roles == null) {roleCond = true}
            else if (roles.length < 1) {roleCond = true}
            
            const embed = new EmbedBuilder()
                .setColor("Blurple").setTitle("Autorole - Information")
                .setDescription("Do you want to give any new members who join your server roles automatically?\nWell, you can with Autorole!\nAutorole automatically gives roles you tell me to give to any new member who joins.\nMake your **new members** feel honoured today.")
                .addFields(
                    { name: "Roles", value: `${(!roleCond)?roleArray:"No roles have been set up yet."}` },
                )
            await interaction.reply({embeds: [embed]})
            
            
        } else if (subcmd == "setup") {
            const getRole = await db.get(`${interaction.guild.id}_roles`)
            if (getRole !== null) {
                const errEmbed  = new EmbedBuilder()
                    .setColor("Red").setTitle("Autorole - Already set up!")
                    .setDescription("This server already has Autorole set up.\nDelete the autorole data first with `/autorole delete`, and run this command again.")
                return interaction.reply({embeds: [errEmbed], ephemeral: true})
            }

            const role = interaction.options.getRole("role")

            db.push(`${interaction.guild.id}_roles`, role.id)

            const embed = new EmbedBuilder()
                .setColor("Green").setTitle("Autorole - Setup Complete")
                .setDescription(`The setup has been completed.\n**Automated Role:** ${role}`)
                .setFooter({text: "TIP: Do you want to give more than 1 role to a new member? Use `/autorole addrole <role>` to add a role to Autorole."})
            interaction.reply({ embeds: [embed] })
        } else if (subcmd == "delete") {
            db.delete(`${interaction.guild.id}_roles`)

            const embed = new EmbedBuilder()
                .setColor("Green").setTitle("Autorole - Data Deleted.")
                .setDescription("This server's Autorole data has been deleted.\nWhen a new member joins, that new member will not receive any role.\nIf you want to set this up again, you may do `/autorole setup`.")
            
            interaction.reply({embeds: [embed]})
        } else if (subcmd == "addrole") {
            const role = interaction.options.getRole("role")

            const dbRoles = await db.get(`${interaction.guild.id}_roles`)
            for (const loopRole in dbRoles) {
                if (dbRoles[loopRole] == role.id) {
                    const errEmbed = new EmbedBuilder()
                        .setColor("Red").setTitle("Role is in Autorole!")
                        .setDescription(`The role ${role} is already in the Autorole.\nPlease specify another role, or remove this role with \`/autorole removerole <role>\`.`)
                    return interaction.reply({embeds: [errEmbed]})
                }   
            }

            db.push(`${interaction.guild.id}_roles`, role.id)

            const embed = new EmbedBuilder()
                .setColor("Green").setTitle("Autorole - Added role")
                .setDescription(`The role ${role} has been added to Autorole.\nEvery new member will receive this role, along with the other ones.`)
            return interaction.reply({embeds: [embed]})
        } else if (subcmd == "removerole") {
            const role = interaction.options.getRole("role")

            db.pull(`${interaction.guild.id}_roles`, role.id)

            const embed = new EmbedBuilder()
                .setColor("Green").setTitle("Autorole - Removed role")
                .setDescription(`The role ${role} has been removed from Autorole.\nNo one will receive this role.`)
            return interaction.reply({embeds: [embed]})
        } else if (subcmd == "test") {
            interaction.client.emit("guildMemberAdd", interaction.member)

            const embed = new EmbedBuilder()
                .setColor("Green").setTitle("Autorole - Testing")
                .setDescription("The test should have been performed.\nIf you have a logging channel, a message should have been sent there right now.")
            return interaction.reply({embeds: [embed]})
        }
    }
}

