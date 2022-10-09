const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, InteractionType } = require("discord.js")
const { loopCommands } = require("../../functions/utils/functions")
const fs = require("fs")

// Databases
const { QuickDB } = require("quick.db")
const db = new QuickDB({filePath: "./database/distune_bans.sqlite"})

module.exports = {
    name: "interactionCreate",
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const {commands} = client
            const {commandName} = interaction
            const command = commands.get(commandName)

            // Guild ban check
            const guildBans = await db.get("guild_bans")
            let guildBanned = false
            let guildBanInfo
            for (const loopBans in guildBans) {
                const loopID = guildBans[loopBans].split(";")[0]
                if (loopID == interaction.guild.id) {
                    guildBanned = true
                    guildBanInfo = guildBans[loopBans].split(";")
                }
            }

            if (guildBanned) {
                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("This server is DisTune banned!")
                    .setDescription("Unfortunately, this server has broken the rules of DisTune.\nFor more details, check out our ban guide [here](https://distune.gitbook.io/welcome/frequent-asked-questions-faq/distune-bans).")
                    .addFields(
                        {name: "Ban ID", value: guildBanInfo[1], inline: true},
                        {name: "Ban Reason", value: guildBanInfo[2], inline: true}
                    )
                    .setFooter({text: "Do NOT share the Ban ID with anyone else. Please blur it out in any screenshots, pictures or videos."})
                return await interaction.reply({embeds: [embed], ephemeral: true})
            }

            // User ban check
            const userBans = await db.get("user_bans")
            let userBanned = false
            let userBanInfo
            for (const loopBans in userBans) {
                const loopID = userBans[loopBans].split(";")[0]
                if (loopID == interaction.user.id) {
                    userBanned = true
                    userBanInfo = userBans[loopBans].split(";")
                }
            }

            if (userBanned) {
                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("You are DisTune banned!")
                    .setDescription("Unfortunately, you have broken the rules of DisTune.\nFor more details, check out our ban guide [here](https://distune.gitbook.io/welcome/frequent-asked-questions-faq/distune-bans).")
                    .addFields(
                        {name: "Ban ID", value: userBanInfo[1], inline: true},
                        {name: "Ban Reason", value: userBanInfo[2], inline: true}
                    )
                    .setFooter({text: "Do NOT share the Ban ID with anyone else. Please blur it out in any screenshots, pictures or videos."})
                return await interaction.reply({embeds: [embed], ephemeral: true})
            }

            // Permissions handler & dev command cheker
            const cmdHandler = loopCommands()
            for (cmd in cmdHandler) {
                const split = cmdHandler[cmd].split(";")
                const finalFile = require(`../../commands/${split[0]}/${split[1]}`)
                if (split[1].startsWith(commandName) && finalFile.permission && !interaction.member.permissions.has(finalFile.permission)) {
                    const permErr = new EmbedBuilder()
                        .setColor("Red").setTitle("No Permission!")
                        .setDescription(`Sorry, but you don't have permission to use this command.\nYou need \`${finalFile.permission}\` permission to use this command.\nIf you are sure you have this permission, contact your server's administrator.`)
                    return interaction.reply({embeds: [permErr], ephemeral: true})
                } /*else if (finalFile.devonly && interaction.member.id !== '702044939520835587') {
                    const embed = new EmbedBuilder()
                        .setColor("Red").setTitle("Command for developers only.")
                        .setDescription("This command is only available to the bots developers.")
                    return interaction.reply({embeds: [embed], ephemeral: true})
                }*/
            }

            if (!command) return

            try {
                await command.execute(interaction, client)
            } catch (error) {
                console.error(error)
                const button = new ButtonBuilder()
                    .setURL("https://discord.gg/vpjefqnRYR")
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Join Support Server")

                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("Internal Error!")
                    .setDescription(`Do not worry, you did not do anything wrong!\nThis is an internal error, and should be reported to the developers.\nScreenshot this message and make a ticket with this: \`\`\`\n${error}\`\`\``)
                
                setTimeout(() => {
                    if (interaction.replied) {return interaction.followUp({embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})}
                    else if (interaction.deferred) {return interaction.editReply({embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})}
                    else {return interaction.reply({embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})}
                }, 350)
            }
        } else if (interaction.isAutocomplete()) {
            const { commands } = client
            const { commandName } = interaction
            const command = commands.get(commandName)
            if (!command) return

            try {
                await command.autocomplete(interaction, client)
            } catch (error) {
                console.error(error)
                const button = new ButtonBuilder()
                    .setURL("https://discord.gg/vpjefqnRYR")
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Join Support Server")

                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("Internal Autocomplete Error")
                    .setDescription(`Do not worry, you did not do anything wrong!\nAn error regarding the autocomplete of the command \`${commandName}\` has occured.\nContact support immediately by joining the support Discord by clicking the button below. \`\`\`\n${error}\`\`\``)
                return interaction.channel.send({content: `${interaction.member}`, embeds: [embed], components: [new ActionRowBuilder().addComponents(button)]})
            }
        }
    }
}