const { REST } = require("@discordjs/rest");
const fetch = require("node-fetch");
const { Routes } = require("discord-api-types/v9");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const { readdirSync } = require("fs");
require("dotenv").config();
const client = require("../index");
let i = 0;
const { result } = require("../coindata/ethereum.json");

const { updateGas } = require("./updateGas");
updateGas();

client.once("ready", async () => {
  const commandFiles = readdirSync("./src/commands/").filter((file) =>
    file.endsWith(".js")
  );


  const commands = [];

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const CLIENT_ID = client.user.id;

  const rest = new REST({
    version: "9",
  }).setToken(process.env.TOKEN);

  (async () => {
    try {
      if (process.env.STATUS === "PRODUCTION") {
        await rest.put(Routes.applicationCommands(CLIENT_ID), {
          body: commands,
        });
        console.log("Successfully registered commands globally");
      } else {
        await rest.put(
          Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID),
          {
            body: commands,
          }
        );
        console.log("Successfully registered commands locally");
      }
    } catch (err) {
      if (err) console.error(err);
    }
  })();

  setInterval(() => {
    let status = [
      `⚡${result.FastGasPrice} |🚶${result.ProposeGasPrice} |🐢${result.SafeGasPrice} |`,
    ];

    client.user.setPresence({
      activities: [{ name: `${status}` }],
      status: "dnd",
    });

    console.log("test");
  }, 15000);
});
