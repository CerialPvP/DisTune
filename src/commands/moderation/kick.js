const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits, GuildMember, ColorResolvable, Embed } = require("discord.js")

var name = "kick"
var desc = "Kick a user from a Discord server."

/**
 * Kick function.
 * @param {GuildMember} member
 * @param {String} reason 
 * @param {Boolean|null} embedNotSent
 * @returns {EmbedBuilder} The embed.
 */
async function kickMember(member, reason, embedNotSent) {
    let err = false
    const kick = await member.kick(reason).catch(e => {err = true})
    
    if (err) {
        const embed2 = new EmbedBuilder()
            .setColor("Red").setTitle("An error occured whilst kicking this member.")
            .setDescription(`This error has appeared because of 2 possible causes:\n\`-\` The role of that member is higher than the bot's role.\n\`-\` The bot generally doesn't have permissions to kick members.\nCheck both causes, and then try kicking the member again.`)
        return embed2
    } else {
        /** @type {ColorResolvable} */
        let color

        if (embedNotSent) {color = "Orange"} else {color = "Green"}
        const embed1 = new EmbedBuilder()
            .setColor(color).setTitle("Kicked successfully.")
            .setDescription(`The member ${member} has been kicked from this server.\nThey will be able to rejoin this server with a new invite.${(embedNotSent)?"\n**:warning: The kick embed has not been sent to the kicked member because they had their DM's closed. :warning:**":""}`)
            .addFields({name: "Kick Reason", value: reason})
        return embed1
    }
}

module.exports = {
    name: name,
    description: desc,
    permission: PermissionFlagsBits.ModerateMembers,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addUserOption(option => option.setName("user").setDescription("The user you want to kick.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the kick.").setRequired(true)),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        await interaction.deferReply()
        const user = interaction.options.getUser("user")
        const reason = interaction.options.getString("reason")

        const member = interaction.guild.members.cache.get(user.id)
        if (!member) {
            const errEmbed = new EmbedBuilder() 
                .setColor("Red").setTitle("That member is not in this server.")
                .setDescription(`The member ${user} has either left the server or that member never joined.`)
            return await interaction.editReply({embeds: [errEmbed]})
        }

        // Send the kick embed first to the member
        let embedSendError = false
        const kickEmbed = new EmbedBuilder()
            .setColor("Orange").setTitle("You have been kicked!")
            .setDescription(`You got kicked from the server **${interaction.guild.name}**.`)
            .addFields(
                {name: "Moderator", value: `${interaction.member}`, inline: true},
                {name: "Reason", value: reason, inline: true}
            )
        await user.send({embeds: [kickEmbed]}).catch(err => {
            embedSendError = true
        })

        // Kick the member using the kick function above
        const embed = await kickMember(member, reason, embedSendError)
        return await interaction.editReply({embeds: [embed]})
    }
}