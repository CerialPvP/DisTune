const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { loopCommands } = require('../../functions/utils/functions')
const fs = require('fs')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const {commands} = client;
            const {commandName} = interaction;
            const command = commands.get(commandName);

            // Permissions handler
            const cmdHandler = loopCommands()
            for (cmd in cmdHandler) {
                const split = cmdHandler[cmd].split(";")
                const finalFile = require(`../../commands/${split[0]}/${split[1]}`)
                if (split[1].startsWith(commandName) && finalFile.permission && !interaction.member.permissions.has(finalFile.permission)) {
                    const permErr = new EmbedBuilder()
                        .setColor("Red").setTitle("No Permission!")
                        .setDescription(`Sorry, but you don't have permission to use this command.\nYou need \`${finalFile.permission}\` permission to use this command.\nIf you are sure you have this permission, contact your server's administrator.`)
                    return interaction.reply({embeds: [permErr], ephemeral: true})
                }
            }

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error)
                const button = new ButtonBuilder()
                    .setURL("https://discord.gg/vpjefqnRYR")
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Join Support Server");

                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("Internal Error!")
                    .setDescription(`Do not worry, you did not do anything wrong!\nThis is an internal error, and should be reported to the developers.\nScreenshot this message and make a ticket with this: \`\`\`\n${error}\`\`\``)
                
                setTimeout(() => {
                    if (interaction.replied) {return interaction.followUp({embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})}
                    else if (interaction.deferred) {return interaction.editReply({embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})}
                    else {return interaction.reply({embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})}
                }, 350);
            }
        } else if (interaction.isButton()) {
            var fileRequired = false
            const folder = fs.readFileSync("./src/components")
            for (const loopFolder in folder) {
                const file = fs.readFileSync(`./src/components/${loopFolder}`).filter(file => file.endsWith('.js'))
                for (const loopFile in file) {
                    const reqFile = require(`../../components/${loopFolder}/${loopFile}`)
                    if (reqFile.components) {fileRequired = true;console.log(`file required fo ${loopFile}`)}
                }
            }

            if (fileRequired) {
                const { buttons } = client
                const { customId } = interaction
                const button = buttons.get(customId)

                if (!button) {
                    const errEmbed = new EmbedBuilder()
                        .setColor("Red").setTitle("Internal Button Error")
                        .setDescription(`The button you just clicked doesn't have any action defined for it.\nPlease go to the support server [here](https://discord.gg/vpjefqnRYR) and report this.`)
                    return interaction.reply({embeds: [errEmbed]})
                }

                try {
                    await button.execute(interaction, client)
                } catch (error) {
                    const errEmbed2 = new EmbedBuilder()
                        .setColor("Red").setTitle("Internal Button Error")
                        .setDescription(`Do not worry, you did not do anything wrong!\nThe button you just clicked has some broken code that should be fixed.\nPlease go to the support server [here](https://discord.gg/vpjefqnRYR) and report this:\`\`\`\n${error}\`\`\``)
                    return interaction.reply({embeds: [errEmbed2]})
                }
            }
        }
    }
}