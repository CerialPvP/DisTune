const fs = require("fs");
const chalk = require("chalk");

module.exports = (client) => {
  client.handleEvents = async () => {
    console.log(chalk.yellowBright("Starting event handler..."));
    const t1 = Date.now();
    const eventFolders = fs.readdirSync(`./src/events`);
    for (const folder of eventFolders) {
      const eventFiles = fs
        .readdirSync(`./src/events/${folder}`)
        .filter((file) => file.endsWith(".js"));
      switch (folder) {
        case "client":
          for (const file of eventFiles) {
            const event = require(`../../events/${folder}/${file}`);
            if (event.once)
              client.once(event.name, (...args) =>
                event.execute(...args, client)
              );
            else
              client.on(event.name, (...args) =>
                event.execute(...args, client)
              );
          }
          break;

        default:
          break;
      }
    }
    console.log(chalk.green(`All events have been registered in ${Date.now()-t1}ms.\n`))
  };
};
