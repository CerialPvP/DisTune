const { ActionRowBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder, EmbedBuilder, ChannelType, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionResponse } = require("discord.js");
const db = new (require("quick.db")).QuickDB({filePath: "./database/welcome.sqlite"})


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
     * @param {*} client 
     */
    async execute(interaction, client) {
        const subcmd = interaction.options.getSubcommand()
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
                            .setValue((await db.get(interaction.guild.id)).welcomemsg || "")
                        ),

                        new ActionRowBuilder().addComponents(new TextInputBuilder()
                            .setCustomId("welcome-leavemsg").setLabel("Leave Message").setRequired(false).setMaxLength(2000)
                            .setStyle(TextInputStyle.Paragraph).setPlaceholder("Put your desired goodbye text here. Placeholders available at /welcome placeholders.")
                            .setValue((await db.get(interaction.guild.id)).leavemsg || "")
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
                        .setDescription(`All your changes have been saved.\nIf you have placeholders, they will be parsed when the member joins!\nTo see an example of your placeholder, run /welcome info.\n\`-\` **Welcome Message**: \`\`\`${modalOptions.welcome}\`\`\`${(modalOptions.leave)?`\n\`-\` **Leave Message:** \`\`\`\n${modalOptions.leave}\`\`\``:""}`)
                    return i.reply({embeds: [embed], ephemeral: true})
                }).catch(err => err)
        
            default:
                break;
        }
    }
};