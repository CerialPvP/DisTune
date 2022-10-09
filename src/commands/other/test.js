const { SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder, ComponentType, WebhookClient } = require("discord.js")
const axios = require("axios").default

var name = "eeeee"
var desc = "This is a command purely for testing purposes."

module.exports = {
    name: name,
    description: desc,

    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(desc),

    async execute(interaction, client) {
        const members = []
        const dMembers = await interaction.guild.members.fetch()
        for (const loopMember of dMembers) {members.push(loopMember)}
        return await interaction.reply(`Members: ${members.size}`)
    }
}