const { ActionRowBuilder, SlashCommandBuilder, EmbedBuilder, ChannelType, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionResponse, Embed, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const db = new (require("quick.db")).QuickDB({filePath: "./database/welcome.sqlite"})
const { welcomePlaceholder } = require("../../functions/utils/functions")

var name = "welcome"
var desc = "Give your new members a warm welcome to the server."

module.exports = {
    name: name,
    description: desc,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addSubcommand(subcommand => subcommand
            .setName("setup").setDescription("Set up the welcome message in your server.")
            .addChannelOption(option => option.setName("channel").setDescription("The channel where the welcome messages will be posted to.").addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement).setRequired(true))
        )

        .addSubcommand(subcommand => subcommand
            .setName("info").setDescription("Get the information of the welcome message.")
        )

        .addSubcommand(subcommand => subcommand
            .setName("placeholders").setDescription("See placeholders you can use in your welcome message.")
        )

        .addSubcommand(subcommand => subcommand
            .setName("delete").setDescription("Delete the welcome message from your server.")
        ),
    
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand()
        // Check if the server has the welcome system set up.
        if (!await db.get(interaction.guild.id) && subcmd !== "setup") {
            const ierrEmbed = new EmbedBuilder()
                .setColor("Red").setTitle("Welcome system not set up!")
                .setDescription("You never set up the DisTune Welcome system.\nTo set it up, run </welcome setup:1040348109563252736>.")
            return await interaction.reply({embeds: [ierrEmbed]})
        }
        switch (subcmd) {
            case "placeholders":
                const embed = new EmbedBuilder()
                    .setColor("Blurple").setTitle("Welcome - Placeholders")
                    .setDescription("These are placeholders you can use in your welcome message.\n**Format:** {placeholder} = value")
                    .addFields(
                        {name: "User Placeholders", value: `{user} = ${interaction.member}\n{username} = ${interaction.user.username}#${interaction.user.discriminator}\n{userid} = ${interaction.user.id}`},
                        {name: "Guild Placeholders", value: `{guild} = ${interaction.guild.name}\n{guildid} = ${interaction.guild.id}\n{channel:${interaction.channel.name}} = ${interaction.channel} (if not found it will show ${interaction.channel.name})\n{membercount} = ${interaction.guild.memberCount}`},
                        {name: "Example", value: `__**Input:**__\`\`\`\nWelcome, {user} to {guild}! ❤️\nWe are now {membercount} members! 👨‍👨‍👧\nCheck out {channel:${interaction.channel.name}}, there are cool stuff there! 💫\`\`\`\n__**Output:**__ \nWelcome, ${interaction.user} to ${interaction.guild.name}! ❤️\nWe are now ${interaction.guild.memberCount} members! 👨‍👨‍👧\nCheck out ${interaction.channel}, there are cool stuff there! 💫`}
                    )
                return await interaction.reply({embeds: [embed]})

            case "setup":
                const options = {
                    channel: interaction.options.getChannel("channel")
                }

                const modal = new ModalBuilder()
                    .setCustomId("welcome").setTitle("Welcome - Welcome Message")
                    .addComponents(
                        new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("welcome-welcomemsg").setLabel("Welcome Message").setRequired(true).setMaxLength(2000)
                            .setStyle(TextInputStyle.Paragraph).setPlaceholder("Put your desired welcome text here. Placeholders available at /welcome placeholders.")
                            //.setValue(`${((await db.get(interaction.guild.id)).welcomemsg)?(await db.get(interaction.guild.id)).welcomemsg:""}`)
                        ),

                        new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("welcome-leavemsg").setLabel("Leave Message").setRequired(false).setMaxLength(2000)
                            .setStyle(TextInputStyle.Paragraph).setPlaceholder("Put your desired goodbye text here. Placeholders available at /welcome placeholders.")
                            //.setValue((await db.get(interaction.guild.id)).leavemsg || "")
                        )
                    )

                await interaction.showModal(modal)
                interaction.awaitModalSubmit({time: 300000}).then(async (i) => {
                    const modalOptions = {
                        welcome: i.fields.getTextInputValue("welcome-welcomemsg").replaceAll("`", ""),
                        leave: i.fields.getTextInputValue("welcome-leavemsg").replaceAll("`", "")
                    }

                    db.set(interaction.guild.id, {channel: options.channel.id, welcomemsg: modalOptions.welcome, leavemsg: modalOptions.leave || null})

                    const embed = new EmbedBuilder()
                        .setColor("Green").setTitle("Welcome - Setup Successful")
                        .setDescription(`All your changes have been saved.\nIf you have placeholders, they will be parsed when the member joins!\nTo see an example of your placeholder, run </welcome info:1040348109563252736>.\n\`-\` **Welcome Message**: \`\`\`${modalOptions.welcome}\`\`\`${(modalOptions.leave)?`\n\`-\` **Leave Message:** \`\`\`\n${modalOptions.leave}\`\`\``:""}`)
                    return i.reply({embeds: [embed], ephemeral: true})
                }).catch(err => err)
                break
            
            case "info":
                const info = await db.get(interaction.guild.id)

                const obj = {
                    welcomeOut: await welcomePlaceholder(info.welcomemsg, interaction.user, interaction.guild),
                    leaveOut: (info.leavemsg)?await welcomePlaceholder(info.leavemsg, interaction.user, interaction.guild):null
                }

                const iEmbed = new EmbedBuilder()
                    .setColor("Blurple").setTitle("Welcome - Information")
                    .addFields(
                        {name: "Welcome", value: `__**Input:**__ \`\`\`\n${info.welcomemsg}\`\`\`\n__**Output:**__ \n${obj.welcomeOut}`},
                        {name: "Leave", value: `${(info.leavemsg)?`__**Input:**__ \`\`\`\n${info.leavemsg}\`\`\`\n__**Output:**__ \n${obj.leaveOut}`:"A leave message is not set."}`}
                    )
                return await interaction.reply({embeds: [iEmbed]})
            
            case "delete":
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId("welcome-delete-yes").setLabel("Yes").setStyle(ButtonStyle.Success).setEmoji("✅"),
                    new ButtonBuilder()
                        .setCustomId("welcome-delete-no").setLabel("No").setStyle(ButtonStyle.Danger).setEmoji("❌")
                )

                const confEmbed = new EmbedBuilder()
                    .setColor("Yellow").setTitle("Are you sure?")
                    .setDescription("Once your delete the welcome system, new members will not be greeded with a welcome message.\nAre you sure you want to proceed?\nYou have 10 seconds to decide.")
                await interaction.reply({embeds: [confEmbed], components: [row]}).then((m) => {
                    const collector = m.createMessageComponentCollector({componentType: ComponentType.Button, time: 10000})
                    let noEdit = false
                    collector.on("collect", async (i) => {
                        // Check if the user clicking the button is not the member who initialized the interaction
                        if (i.user.id !== interaction.user.id) {
                            const butErrEmbed = new EmbedBuilder()
                                .setColor("Red").setTitle("Not your interaction!")
                                .setDescription("This is not your button interaction.")
                            return i.reply({embeds: [butErrEmbed], ephemeral: true})
                        }

                        await i.deferUpdate().catch(err => err)
                        if (i.customId == "welcome-delete-yes") {
                            noEdit = true
                            const butSuccessEmbedReply = new EmbedBuilder()
                                .setColor("Green").setTitle("Welcome system deleted.")
                                .setDescription("You have successfully deleted the welcome system.")
                            await interaction.editReply({embeds: [butSuccessEmbedReply], components: []})

                            const butSuccessEmbedNotReply = new EmbedBuilder()
                                .setColor("Yellow").setTitle("Welcome system deleted.")
                                .setDescription(`The user ${interaction.user} has deleted the welcome system.\nWelcome messages will no longer be sent here.`)
                            await (interaction.guild.channels.cache.get((await db.get(interaction.guild.id)).channel)).send({embeds: [butSuccessEmbedNotReply]})

                            await db.delete(interaction.guild.id)
                        } else if (i.customId == "welcome-delete-no") {
                            noEdit = true
                            const butCancelEmbed = new EmbedBuilder()
                                .setColor("Red").setTitle("Cancelled deletion of welcome system.")
                                .setDescription("You have selected to not delete the welcome system.\nNew members will still be greeted with your server's welcome message.")
                            await interaction.editReply({embeds: [butCancelEmbed], components: []})
                        }
                    })

                    collector.on("end", async () => {
                        if (noEdit) return
                        const disable = row
                        disable.components.forEach(c => c.setDisabled(true))
                        return await interaction.editReply({components: [disable]}).catch(err => err)
                    })
                })
        
            default:
                break
        }
    }
};