const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js')
//const { developers } = require('../config.json')

var name = "eval"
var desc = "Make bot say execute something."

const clean = async (text) => {
    if (text && text.constructor.name == "Promise")
      text = await text
    if (typeof text !== "string")
      text = require("util").inspect(text, { depth: 1 })
    text = text
      .replace(/`/g, "`" + String.fromCharCode(8203))
      .replace(/@/g, "@" + String.fromCharCode(8203))
    return text
}

module.exports = {
    name: name,
    description: desc,
    deferReply: false,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(desc)
        .addStringOption(option =>
            option.setName("code")
                .setDescription("If you are going to execute multiline codes leave this option empty.")
                .setRequired(false)
        )
        .addBooleanOption(option =>
            option.setName("ephemeral")
                .setDescription("If you want the code executed to be only shown for you select 'True'")
                .setRequired(false)
        ),
    async execute(interaction, client){

        if (!interaction.user.id == "702044939520835587" || !interaction.user.id == "410781931727486976") {return interaction.reply({content: "You do not have permission to use eval!", ephemeral: true})}
        if (!interaction.options.getString("code")){
            const modal = new ModalBuilder()
                .setCustomId("eval")
                .setTitle("Eval")
                .addComponents(new ActionRowBuilder()
                    .addComponents(new TextInputBuilder()
                        .setCustomId("code")
                        .setLabel("Code")
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder("The code to be executed.")
                        .setRequired(true)
                    )
                )
            interaction.showModal(modal)
            const filter = (interaction) => interaction.customId === 'eval';
            interaction.awaitModalSubmit({ filter, time: 120000 })
            .then(inter => {
                check(inter, inter.fields.getTextInputValue("code"), interaction.options.getBoolean("ephemeral") || false)
            })
            .catch(err => err)
        }else{
            check(interaction, interaction.options.getString("code"), interaction.options.getBoolean("ephemeral") || false)
        }
    }
}

async function check(interaction, code, ephemeral){
    const illegalCodes = ["token", "require"]
    const foundIllegals = []
    for (const icode of illegalCodes){
        if (code.includes(icode)){
            foundIllegals.push(icode)
        }
    }
    if (foundIllegals.length > 0){
        const embed = new EmbedBuilder()
            .setColor("Red").setTitle("Found illegal codes!").setDescription(`**Illegal codes:** \`${foundIllegals.join(", ")}\`\n\nDo you want to continue executing the code?`)
        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("yes")
                    .setLabel("Yes")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId("no")
                    .setLabel("No")
                    .setStyle(ButtonStyle.Danger)
            )
        const message = await interaction.reply({embeds: [embed], components: [buttons], ephemeral: ephemeral})

        const filter = i => {
            i.deferUpdate();
            return i.user.id === interaction.user.id;
        };
        
        message.awaitMessageComponent({ filter, componentType: ComponentType.Button, time: 30000 })
            .then(inter => {
                if (inter.customId == "yes"){
                    interaction.editReply({components: []})
                    done(interaction, code, ephemeral, true)
                }else {
                    embed.setDescription("You have decided not to execute the code.")
                    interaction.editReply({embeds: [embed], components: []})
                }
            })
            .catch(err => err);
    }else{
        done(interaction, code, ephemeral, false)
    }
}

async function done(interaction, code, ephemeral, foundIllegals){
    const embed = new EmbedBuilder()
        .setColor('Yellow').setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
        .setFooter({text: "Executing..."})
    function setEvalEmbedDesc(code, result){
        embed.setDescription(`__Your current code:__ \`\`\`js\n${code}\`\`\`\n__Parser Results:__\`\`\`json\n${result}\`\`\``)
    }
    setEvalEmbedDesc(code, "Under Execution...")
    if (foundIllegals == true){
        await interaction.editReply({embeds: [embed], ephemeral: ephemeral})
    }else{
        await interaction.reply({embeds: [embed], ephemeral: ephemeral}).catch(err => err)
    }
    var tookTime = new Date()
    try {
        const evaled = eval(code)
        const result = await clean(evaled)
        if (result.length > 4000){
            embed.setColor("DarkVividPink")
            setEvalEmbedDesc(code, `The result is too long to show because of discord limitations.\nResult length: ${result.length}`)
            return interaction.editReply({embeds: [embed]})
        }
        embed.setColor("Green").setFooter({text: `Took ${new Date() - tookTime}ms to execute.`})
        setEvalEmbedDesc(code, result)
        interaction.editReply({embeds: [embed]})
    }catch(err){
        embed.setColor("Red").setFooter({text: "An error occured while executing."})
        setEvalEmbedDesc(code, err)
        interaction.editReply({embeds: [embed]})
    }
}
