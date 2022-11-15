const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js")
const { getFullTimeTextFromMS } = require("../../functions/utils/functions")

var name = "uptime"
var desc = "Get the uptime of the bot."

module.exports = {
    name: name,
    description: desc,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor("Green").setTitle("Uptime")
            .setDescription(`The bot uptime is: \n**${getFullTimeTextFromMS(interaction.client.uptime)}**`)
        return await interaction.reply({embeds: [embed]})
    }
}
