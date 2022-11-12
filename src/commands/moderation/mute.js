const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits, GuildMember, ColorResolvable, Embed } = require("discord.js")
const ms = require("ms")

var name = "mute"
var desc = "Mute a user for an amount of time."

/**
 * Mute function.
 * @param {GuildMember} member The muted member.
 * @param {GuildMember} ogmember The moderator.
 * @param {Number} ms
 * @param {String} reason 
 * @param {Boolean|null} embedNotSent
 * @returns {EmbedBuilder} The embed.
 */
async function muteMember(member, ogmember, ms, reason, embedNotSent) {
    let err = false
    const mute = await member.timeout(ms, `[Muted by ${ogmember}] ${reason}`).catch(e => {err = true;console.log(e)})

    if (err) {
        const embed2 = new EmbedBuilder()
            .setColor("Red").setTitle("An error occured whilst muting this member.")
            .setDescription(`This error has appeared because of 2 possible causes:\n\`-\` The role of that member is higher than the bot's role.\n\`-\` The bot generally doesn't have permissions to mute members.\nCheck both causes, and then try muting the member again.`)
        return embed2
    } else {
        /** @type {ColorResolvable} */
        let color

        if (embedNotSent) {color = "Orange"} else {color = "Green"}
        const embed1 = new EmbedBuilder()
            .setColor(color).setTitle("Muted successfully.")
            .setDescription(`The member ${member} has been muted.\nAfter the time passes, they will be able to talk again.${(embedNotSent)?"\n**:warning: The mute embed has not been sent to the kicked member because they had their DM's closed. :warning:**":""}`)
            .addFields({name: "Mute Reason", value: reason})
        return embed1
    }
}

module.exports = {
    name: name,
    description: desc,
    permission: PermissionFlagsBits.ModerateMembers,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addUserOption(option => option.setName("user").setDescription("The user you want to mute.").setRequired(true))
        .addStringOption(option => option.setName("time").setDescription("The time the member should be muted for.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the mute.").setRequired(true)),
    
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

        

        // Mute the member using the kick function above
        const time = ms(interaction.options.getString("time"))
        if (!time) {
            const errEmbed2 = new EmbedBuilder()
                .setColor("Red").setTitle("Invalid time!")
                .setDescription(`The mute length you entered is invalid.\nThe mute length should be like this: \`1d\`.\nIf you need to be more specific, you can use decimals, for example: \`1.5d\`.`)
            return await interaction.editReply({embeds: [errEmbed2]})
        } else if (time >= 2419200000) {
            const errEmbed3 = new EmbedBuilder()
                .setColor("Red").setTitle("Mute length is too long!")
                .setDescription(`The mute length you provided (${interaction.options.getString("time")}) is too long.\nTo mute a member with an unlimited length of time, follow these steps:\n\`-\` Type **/serversettings**\n\`-\` Go to **Mute** category\n\`-\` Go to **Mute Type**\n\`-\` Change the type from **Timeout** to **Role**\n\`-\` Go back and then go to **Mute Role**\n\`-\` Change the mute role to an existing mute role you have or make a new one automatically by selecting **Make a new Mute Role**\n\`-\` Try muting the member again`)
            return await interaction.editReply({embeds: [errEmbed3]})
        }

        // Send the kick embed first to the member
        let embedSendError = false
        const kickEmbed = new EmbedBuilder()
            .setColor("Orange").setTitle("You have been muted!")
            .setDescription(`You got muted in the server **${interaction.guild.name}**.`)
            .addFields(
                {name: "Moderator", value: `${interaction.member}`, inline: true},
                {name: "Reason", value: reason, inline: true}
            )
        await user.send({embeds: [kickEmbed]}).catch(err => {
            embedSendError = true
        })

        const embed = await muteMember(member, interaction.member, time, reason, embedSendError)
        return await interaction.editReply({embeds: [embed]})
    }
}