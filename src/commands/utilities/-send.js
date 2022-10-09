/**
 * Send messages with custom embeds.
 * Made by Cerial
 */

const { default: axios } = require("axios")
const { SlashCommandBuilder, SlashCommandSubcommandBuilder, WebhookClient, PermissionFlagsBits, EmbedBuilder } = require("discord.js")

var name = "send"
var desc = "Send messages with custom embeds (Supports Webhooks too!)"

module.exports = {
    name: name,
    description: desc,
    permission: PermissionFlagsBits.ManageMessages,
    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc)
        .addSubcommand(subcommand => subcommand
            .setName("sendmessage").setDescription("Send a message.")
            .addStringOption(option => option.setName("message").setDescription("The message you want to send.").setRequired(true))
            .addStringOption(option => option.setName("webhook").setDescription("If you want to send the message with a webhook, enter the URL here!").setRequired(false))
            .addChannelOption(option => option.setName("channel").setDescription("(Doesn't work with webhooks) The channel you want me to send the message to."))
        )

        .addSubcommand(subcommand => subcommand
            .setName("sendembed").setDescription("Send an embed.")
        ),
    
    async execute(interaction, client) {
        const subcmd = interaction.options.getSubcommand()
        if (subcmd == "sendmessage") {
            const message = interaction.options.getString("message")
            /**
             * man aspect was right typescript is pogr
             * @type {String}
             */
            const reallyRawURL = interaction.options.getString("webhook")
            
            
            if (reallyRawURL) {
                /**
                 * once again
                 * @type {String}
                 */
                const rawURL = interaction.options.getString("webhook").replace("https://discord.com/api/webhooks/", "")
                const webhookUrl = rawURL.split("/")
                const webhook = new WebhookClient({id: webhookUrl[0], token: webhookUrl[1]})
                let invalid = false
                await axios.get(reallyRawURL).catch(function(){invalid = true})
                if (invalid) {
                    const embed = new EmbedBuilder()
                        .setColor("Red").setTitle("Messages - Invalid Webhook")
                        .setDescription("The webhook URL you provided is invalid.")
                    return await interaction.reply({embeds: [embed], ephemeral: true})
                } else {
                    const embed = new EmbedBuilder()
                        .setColor("Green").setTitle("Messages - Message sent")
                        .setDescription(`The message \`${message}\` has been sent using the provided webhook.\nThe message is in the channel the webhook has been setup.`)
                    await interaction.reply({embeds: [embed], ephemeral: true})
                    return await webhook.send({content: message})
                }
            } else {
                const channel = interaction.options.getChannel("channel") || interaction.channel
                await channel.send(message).catch((error) => {
                    console.error(error)
                })
                const embed = new EmbedBuilder()
                    .setColor("Green").setTitle("Messages - Message sent")
                    .setDescription(`The message \`${message}\` has been sent to the channel ${channel}.`)
                return await interaction.reply({embeds: [embed], ephemeral: true})
            }
        }
    }
}