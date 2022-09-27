const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { loopCommands } = require('../../functions/utils/functions')

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
        }
    }
}