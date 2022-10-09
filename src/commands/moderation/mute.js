const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChatInputCommandInteraction } = require("discord.js")
const ms = require("ms")

var name = "mute"
var desc = "Mute people for a certain amount of time."

module.exports = {
    name: name,
    description: desc,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addUserOption(option => option.setName("user").setDescription("The user you want to mute!").setRequired(true))
        .addStringOption(option => option.setName("time").setDescription("The time to mute the user for.").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("The reason for the mute.").setRequired(true)),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        const user = interaction.options.getUser("user")
        const timeString = interaction.options.getString("time")
        const reason = interaction.options.getString("reason")

        // Time converter
        const time = ms(timeString)
        if (!time) {
            const errEmbed = new EmbedBuilder()
                .setColor("Red").setTitle("Invalid Timestamp")
                .setDescription("The timestamp that has been provided is invalid.\nTimestamps should be entered like this: `1d`.\nIf you want a more precise time, use decimals instead, for example: `1.5d`.")
            return await interaction.reply({embeds: [errEmbed], ephemeral: true})
        } else {
            user.timeout(time, reason).catch(error => {
                let perm = false
                if (error.endsWith("Missing Permissions")) {perm = true}

                const errEmbed2 = new EmbedBuilder()
                    .setColor("Red").setTitle(`${(perm)?"Can't mute this person.":"An error occured."}`)
                    .setDescription(`${(perm)?"The person you tried to mute is above my roles, therefore I can't mute them.":`This error shouldn't have happened.\nIf you see this, please report this to DisTune Support. \`\`\`\n${error}\`\`\``}`)
                return interaction.reply({embeds: [errEmbed2]})
            }).then(async function() {
                const longTime = ms(timeString, {long: true})
                const sendEmbed = new EmbedBuilder()
                    .setColor("Orange").setTitle("You are muted!")
                    .setDescription(`You have been muted in the server ${interaction.guild.name}.`)
                    .addFields(
                        {name: "Moderator", value: interaction.member, inline: true},
                        {name: "Time", value: longTime, inline: true}
                    )
                await user.send({embeds: [sendEmbed]}).catch((err) => {

                })

            })


        }
    }
}

