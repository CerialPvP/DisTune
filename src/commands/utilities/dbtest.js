/**
 * This is just to test quick.db, nothing special.
 */

const { QuickDB } = require('quick.db')
const db = new QuickDB({ filePath: "./database/test.sqlite" })
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dbtest")
        .setDescription("Test quick.db."),
    
    async execute(interaction, client) {
        db.add(`executed_${interaction.user.id}`, 1)
        interaction.reply("Test finished.")
    }
}