/**
 * A command which gives a list of all commands.
 */

const { SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder, parseResponse } = require('discord.js')
const { loopCommands } = require('../../functions/utils/functions')

var name = "help"
var desc = "A command which gives a list of all commands."

 

module.exports = {
    name: name,
    description: desc,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(desc)
        .addStringOption(option => option.setName("command").setDescription("The command you want me to tell you information about!").setAutocomplete(true).setRequired(false)),
    
    async autocomplete(interaction, client) {
        const focused = interaction.options.getFocused(true)
        let choices = []

        if (focused.name == "command") {
            const cmdHandler = loopCommands();
            for (cmd in cmdHandler) {
                const s = cmdHandler[cmd].split(';')
                const split = s[1].replace(".js", "")
                if (split.startsWith("-")) continue;
                
                choices.push(split)
            }
        }

        const filtered = choices.filter(choice => choice.startsWith(focused.value))
        await interaction.respond(
            filtered.map(choice => ({name: choice, value: choice}))
        );
    },

    async execute(interaction, client) {
        const cmdOp = interaction.options.getString("command")
        let category;

        if (cmdOp !== null) {
            const cmdHandler = loopCommands();
            var exists = false;
            for (cmd in cmdHandler) {
                const s = cmdHandler[cmd].split(';')
                const split = s[1].replace(".js", "")
                if (split.startsWith("-")) continue;
                if (cmdOp == split) {
                    exists = true;
                    category = require(`../${s[0]}/category.json`);
                    console.log(category);
                    break;
                }
            }

            if (!exists) {
                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("Command doesn't exist!")
                    .setDescription(`The command you've entered, \`${cmdOp}\`, does not exist.\nDouble check the spelling of the command, and then try again.\n**REMEMBER: Command names are all lower-case.\nFor example: "Help" is incorrect, and "help" is correct.**`)
                return interaction.reply({embeds: [embed], ephemeral: true})
            } else {
                const command = client.commands.get(cmdOp)
                const subcommands = []
                for (const option of command.data.options) {
                    if (!option.type) {subcommands.push(`\`-\` /${command.data.name} ${option.name} - ${option.description}\n`)}
                }
                const sEmbed = new EmbedBuilder()
                    .setColor("Green").setTitle("Command Found.")
                    .setThumbnail("https://cdn.discordapp.com/attachments/809401069489750057/1024305259843162152/distune_slash.png")
                    .addFields(
                        {name: "Command Name", value: command.data.name, inline: true},
                        {name: "Description", value: command.description, inline: true},
                        {name: "Category", value: `${(category == null)?"The category is not set! Contact the developers immediately!":`:${category.emoji}: ${category.name}`}`, inline: true},
                        {name: "Sub-commands", value: `${(subcommands.length <= 1)?"No sub-commands are present here.":subcommands.join("")}`}
                    )
                return interaction.reply({embeds: [sEmbed]})
            }
            
        } else {
            const comingSoon = new EmbedBuilder()
                .setColor("Red").setTitle("Coming soon!")
                .setDescription("For now, you can look up specific commands with the `command` option.")
            await interaction.reply({embeds: [comingSoon], ephemeral: true})
        }
    }
}