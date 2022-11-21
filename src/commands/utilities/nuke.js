const { ButtonBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonStyle, ComponentType } = require("discord.js")

var name = "nuke"
var desc = "\"Nuke\" a channel (deletes all messages from a channel)"

module.exports = {
    name: name,
    description: desc,
    permission: PermissionFlagsBits.ManageChannels,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addChannelOption(option => option.setName("channel").setDescription("The channel you want to nuke.").addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true))
        .addIntegerOption(option => option.setName("time").setDescription("The amount of seconds it will take for the channel to be nuked. Default is 5 seconds.").setRequired(false)),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const sTime = interaction.options.getInteger("time") || 5
        const time = sTime * 1000
        console.log(`${sTime} ${time}`)
        if (time > 300000 || time < 5000) {
            const errEmbed = new EmbedBuilder()
                .setColor("Red").setTitle("Too " + (time >= 300000)?"long!":(time <= 5000)?"short!":"")
                .setDescription(`The time cannot be ${(time >= 300000)?"longer than 5 minutes (300 seconds)":(time <= 5000)?"shorter than 5 seconds":""}.`)
            return interaction.reply({embeds: [errEmbed], ephemeral: true})
        }

        const channel = interaction.options.getChannel("channel")

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("nuke-cancel").setStyle(ButtonStyle.Danger)
                .setLabel("Cancel Nuke").setEmoji("❌")
        )

        let cancelDel = false

        const embed = new EmbedBuilder()
            .setColor("Yellow").setTitle("Nuking Channel")
            .setDescription(`The channel ${channel} will be nuked in ${sTime} ${(sTime == 1)?"second":"seconds"}. Adios!`)
        const m = await interaction.reply({embeds: [embed], components: [row], fetchReply: true})
        

        const cEmbed = new EmbedBuilder()
            .setColor("Yellow").setTitle("Nuking this channel")
            .setDescription(`${interaction.member} has initiated a nuke on this channel. In ${sTime} ${(sTime == 1)?"second":"seconds"}, this channel's messages will be gone. Adios!`)
        channel.send({embeds: [cEmbed]}).then(() => {
            setTimeout(() => {
                if (cancelDel) return

                channel.clone().then((c) => {
                    const pos = channel.position

                    channel.delete().catch((err) => err)
                    c.setPosition(pos)

                    const nEmbed = new EmbedBuilder()
                        .setColor("Green").setTitle("Channel was nuked!")
                        .setDescription(`The channel was nuked by ${interaction.member}.`)
                        .setImage("https://media.tenor.com/giN2CZ60D70AAAAC/explosion-mushroom-cloud.gif")
                    c.send({embeds: [nEmbed]})

                    const niEmbed = new EmbedBuilder()
                        .setColor("Green").setTitle("Channel was nuked successfully.")
                        .setDescription("The channel has been nuked successfully.\nAll messages are gone from there.")
                    interaction.editReply({embeds: [niEmbed], components: []})
                })
            }, time);
        })

        const collector = m.createMessageComponentCollector({componentType: ComponentType.Button, time: time})

        collector.on("collect", async (i) => {
            if (i.customId == "nuke-cancel") {
                if (i.user.id !== interaction.user.id) {
                    const nukeErrEmbed = new EmbedBuilder()
                        .setColor("Red").setTitle("Not your button!")
                        .setDescription(`Sorry, but you can't cancel the nuke. Only ${interaction.member} can.`)
                    return i.reply({embeds: [embed]})
                }
                i.deferUpdate().catch((err) => err)

                cancelDel = true
                const nukeCancelEmbed = new EmbedBuilder()
                    .setColor("Green").setTitle("Cancelled successfully.")
                    .setDescription("The nuke has been cancelled. The messages will no longer be deleted.")
                await interaction.editReply({embeds: [nukeCancelEmbed], components: []})

                const nukeCancelEmbed2 = new EmbedBuilder()
                    .setColor("Green").setTitle("Nuke Cancelled.")
                    .setDescription("The nuke has been cancelled. The messages will no longer be deleted.")
                return await channel.send({embeds: [nukeCancelEmbed2]})
            }
        })

        collector.on("end", async () => {
            const disable = row
            disable.components.forEach(c => c.setDisabled(true))
            return await interaction.editReply({components: [disable]}).catch(err => err)
        })
    }
};
