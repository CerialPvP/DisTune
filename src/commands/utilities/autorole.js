/**
 * When a member joins a server, they will receive roles the
 * server owners set up. This is very useful if you can't
 * bother with giving roles manually to people.
 */

const { SlashCommandBuilder, SlashCommandSubcommandBuilder, EmbedBuilder } = require('discord.js')
const db = require('quick.db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autorole")
        .setDescription("Gives a role automatically to new members.")
        .addSubcommand(subcommand =>
            subcommand
                .setName("info")
                .setDescription("View general information about Autorole, and also setup information.")
        ),
    
    async execute(interaction, client) {

    }
}