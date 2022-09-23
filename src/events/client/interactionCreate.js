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
        }
    }
}