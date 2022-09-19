const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const {commands} = client;
            const {commandName} = interaction;
            const command = commands.get(commandName);
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
                
                if (interaction.replied) return interaction.channel.send({embeds: [embed]});
                if (interaction.deferred) return interaction.editReply({embeds: [embed]})
                
                return interaction.reply({embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})
            }
        } else if (interaction.isButton()) {
            const {buttons} = client;
            const {customId} = interaction;
            const button = buttons.get(customId);
            if (!button) {
                const embed = new EmbedBuilder()
                    .setTitle("Internal Button Error").setColor("Red")
                    .setDescription(`The button you pressed on has no action to execute.\nButton ID: \`${customId}\`\nContact the developers immediately.`)
                
                if (interaction.deferred) return interaction.channel.send({embeds: [embed]})
                return interaction.reply({embeds: [embed]})
            }

            try {
                await button.execute(interaction, client);
            } catch (error) {
                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("Internal Error!")
                    .setDescription(`Do not worry, you did not do anything wrong!\nThis is an internal error, and should be reported to the developers.\nScreenshot this message and make a ticket with this: \`\`\`\n${error}\`\`\``)
                
                if (interaction.replied) return interaction.channel.send({embeds: [embed]});
                if (interaction.deferred) return interaction.editReply({embeds: [embed]})
                
                return interaction.reply({embeds: [embed]})
            }
        }
    }
}