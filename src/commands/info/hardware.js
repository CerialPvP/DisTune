/**
 * Monitor the DisTune hardware.
 */

const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js")

const { cpuTemperature } = require("systeminformation")

var name = "hardware"
var desc = "Monitor the DisTune hardware."

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
        cpuTemperature().then(t => console.log(t))
        return await interaction.reply(`consoler!!`)
    }
}