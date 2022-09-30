const { SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, SelectMenuOptionBuilder, ActionRowBuilder, ComponentType } = require('discord.js')

var name = "test"
var desc = "This is a command purely for testing purposes."

module.exports = {
    name: name,
    description: desc,

    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(desc)
        .addStringOption(option => option.setName("option").setDescription("test option").setAutocomplete(true).setRequired(true)),

    async autocomplete(interaction, client) {
        const focused = interaction.options.getFocused(true)
        let choices = []

        if (focused.name == "option") {choices = ['one', 'two', 'three']}
        const filtered = choices.filter(choice => choice.startsWith(focused.value))
        await interaction.respond(
            filtered.map(choice => ({name: choice, value: choice}))
        );
    },

    async execute(interaction, client) {
        const menu = new SelectMenuBuilder()
            .setCustomId("testing")
            .setMinValues(1)
            .setMaxValues(1)
            .setOptions(new SelectMenuOptionBuilder({label: `Option 1`, value: `me when the shit`}),
                new SelectMenuOptionBuilder({label: `Option 2`, value: `Testing 2`})
            )
        
        await interaction.reply({content: "hello bro", components: [new ActionRowBuilder().addComponents(menu)]})

        const collector = (await interaction.fetchReply()).createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 30000 });
        collector.on('collect', async i => {
            await i.deferReply()
            console.log(i.message.components)
        })
    }
}