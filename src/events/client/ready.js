const chalk = require("chalk");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(chalk.green(`The bot is ready! Logged into ${client.user.tag}.`));
  },
};
