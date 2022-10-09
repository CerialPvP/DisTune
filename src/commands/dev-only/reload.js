const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, REST, Routes } = require("discord.js")
const { loadCommands } = require("../../functions/handlers/[NC] loadCommands")
const chalk = require("chalk")
const glob = require("glob")

var name = "reload"
var desc = "Reloads all commands or all events."

module.exports = {
    name: name,
    description: desc,
    devonly: true,

    data: new SlashCommandBuilder()
        .setName(name).setDescription(desc),

    async execute(interaction, client) {
        const t1 = Date.now()
        const embed = new EmbedBuilder()
            .setColor("Yellow").setDescription("<a:distune_loading:1006642541996814336> **Reloading all commands...**")
        await interaction.reply({embeds: [embed]})
        
        interaction.client.commands.sweep(() => true)
        console.log(__dirname)
        glob(`${__dirname}`, async(err, filePaths) => {
            if (err) {
                const embed = new EmbedBuilder()
                    .setColor("Red").setTitle("Internal Reload Error")
                    .setDescription(`An error occured while reloading: \`\`\`\n${err}\`\`\``)
                return await interaction.editReply({embeds: [embed]})
            }
            
            filePaths.forEach((file) => {
                delete require.cache[require.resolve(file)]
            })

        })



        const commandArray = loadCommands(interaction.client, true)
        const rest = new REST({ version: "10" }).setToken(process.env.token_dev)
        try {
            console.log(chalk.yellowBright("Applying all commands to Discord API..."))
    
            await rest.put(Routes.applicationCommands("944574368279822378"), {
                body: commandArray,
            })
    
            console.log(chalk.green(`All commands have been reloaded in ${Date.now()-t1}ms.\n`))
            const embed2 = new EmbedBuilder()
                .setColor("Green").setDescription(`:white_check_mark: **All commands loaded successfully. \`${Date.now()-t1}ms\`**`)
            return await interaction.editReply({embeds: [embed2]})
        } catch (error) {
            console.error(error)
        }

        
    }
}