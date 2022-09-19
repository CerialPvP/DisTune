const fs = require("fs");
const chalk = require("chalk");
const { REST, Routes } = require('discord.js')

module.exports = (client) => {
  client.handleCommands = async () => {
    console.log(chalk.yellowBright("Starting command handler..."));
    const t1 = Date.now();
    const commandFolders = fs.readdirSync(`./src/commands`);
    const { commands, commandArray } = client;
    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith(".js"));
      for (const file of commandFiles) {
        const command = require(`../../commands/${folder}/${file}`);
        commands.set(command.data.name, command);
        commandArray.push(command.data.toJSON());
        console.log(chalk.yellow(`Command ${command.data.name} registered.`));
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.token_dev)
    try {
        console.log(chalk.yellowBright("Applying all commands to Discord API..."))

        await rest.put(Routes.applicationGuildCommands('944574368279822378', '932659866110160936'), {
            body: commandArray,
        });

        console.log(chalk.green(`All commands have been successfully registered in ${Date.now()-t1}ms.\n`))
    } catch (error) {
        console.error(error)
    }
  };
};
