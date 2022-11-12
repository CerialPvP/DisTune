const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

var name = "links"
var desc = "Get useful links you may want to visit."

module.exports = {
    name: name,
    description: desc,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {*} client 
     */
    async execute(interaction, client) {
        const row = new ActionRowBuilder().addComponents(
            // DisTune Github
            new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://github.com/CerialPvP/DisTune").setLabel("DisTune's GitHub").setEmoji("<:distune_github:1033309948337197116>"),

            // DisTune Kofi
            new ButtonBuilder().setStyle(ButtonStyle.Link).setURL("https://ko-fi.com/distune").setLabel("DisTune's Ko-Fi page").setEmoji("<:distune_kofi:1033318069336018954>")
        )

        const embed = new EmbedBuilder()
            .setColor("Blurple").setTitle("DisTune Links")
            .setDescription("The links below are **official** DisTune links.\n**:warning: If you receive any other link which is not an official link, this could be a scam. Beware! :warning:**")

            .setFooter({text: `© DisTune 2021-2022. ${(process.env.watermark_text)?"":"This is an unofficial DisTune bot. For more information, ."}`, iconURL: process.env.watermark_url})
        return await interaction.reply({embeds: [embed], components: [row]})
    }
}
