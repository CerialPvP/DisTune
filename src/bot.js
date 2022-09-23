require("dotenv").config();
/*
If the main bot is used, use "token_main".
If the dev bot is used, use "token_dev".
*/
const { token_dev } = process.env;

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({ intents: GatewayIntentBits.Guilds });
client.commands = new Collection();
client.buttons = new Collection();
client.commandArray = [];

const functionFolders = fs.readdirSync(`./src/functions`);
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith("js"));
  for (const file of functionFiles)
    require(`./functions/${folder}/${file}`)(client);
}

client.handleCommands();
client.handleEvents();
client.login(token_dev);
