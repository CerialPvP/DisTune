const { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, PermissionFlagsBits, ChannelType } = require("discord.js")

var name = "purge"
var desc = "Mass-deletes an amount of messages you'd like."

module.exports = {
    name: name,
    description: desc,
    permission: PermissionFlagsBits.ManageMessages,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addIntegerOption(option => option.setName("amount").setDescription("The amount of messages you'd like to delete.").setMinValue(1).setMaxValue(100).setRequired(true))
        .addChannelOption(option => option.setName("channel").setDescription("The channel you'd like to purge the messages from.").addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(false)),
    
    /**
      * 
      * @param {ChatInputCommandInteraction} interaction 
      * @param {Boolean} flow 
      */
    async execute(interaction, flow) {
        const n1 = Date.now()
        const options = {
            amount: interaction.options.getInteger("amount"),
            channel: interaction.options.getChannel("channel") || interaction.channel
        }

        const embed = new EmbedBuilder()
            .setColor("Yellow").setTitle("Purging Messages...")
            .setDescription(`I am currently purging messages at ${options.channel}, please wait...`)
        await interaction.reply({embeds: [embed]})

        // Purge the messages
        options.channel.messages.fetch({limit: options.amount, before: (await interaction.fetchReply()).id}).then(async m => {
            const replyID = (await interaction.fetchReply()).id
            const filter = m.filter(msg => msg.id !== replyID)
            console.log(filter.size)
            options.channel.bulkDelete(filter, {filterOld: true}).catch(err => console.log(err)).then(() => {console.log("deleted msg")})
            const successEmbed = new EmbedBuilder()
                .setColor("Green").setTitle("Finished purging!")
                .setDescription(`**${filter.size}** messages have been deleted from ${options.channel}.\nThis took **${Date.now()-n1}ms**.`)
            return interaction.editReply({embeds: [successEmbed]})
        })
    }
};