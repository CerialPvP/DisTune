const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ColorResolvable, Client } = require("discord.js")
const { QuickDB } = require("quick.db")
const db = new QuickDB({filePath: "./database/punishments.sqlite"})

var name = "warn"
var desc = "Add a warning to a user."

module.exports = {
    name: name,
    description: desc,
    permission: PermissionFlagsBits.ModerateMembers,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addUserOption(option => option.setName("user").setDescription("The user you want to warn.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the warning.").setRequired(true)),

    /**
     * Execute function.
     * @param {ChatInputCommandInteraction} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser("user")
        const reason = interaction.options.getString("reason")

        await interaction.deferReply()

        db.push(`${user.id}_${interaction.guild.id}_warns`, `${Date.now()};${interaction.member.id};${reason}`)

        let notSent = false

        const dbEmbed = new EmbedBuilder()
            .setColor("Yellow").setTitle("You have been warned!")
            .setDescription(`You have got a warning from the server **${interaction.guild.name}**.`)
            .addFields(
                {name: "Moderator", value: `${interaction.member}`, inline: true},
                {name: "Reason", value: reason, inline: true}
            )
        await user.send({content: `${user}`, embeds: [dbEmbed]}).catch(err => {notSent = true})

        /** @type {ColorResolvable} */
        let color
        if (notSent) color = "Orange"
        else color = "Green"

        const embed = new EmbedBuilder()
            .setColor(color).setTitle("Warned successfully.")
            .setDescription(`The warning has been given to the user ${user}.${(notSent)?"\n**:warning: A DM has not been sent to them because their messages are probably disabled. :warning:**":""}`)
            .addFields(
                {name: "Warning Reason", value: reason}
            )
        return await interaction.editReply({embeds: [embed]})
        
        
    } 
}