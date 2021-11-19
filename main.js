const { Client, Intents, Collection } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const prefix = "+";

const fs = require("fs");
client.commands = new Collection();

const commandFiles = fs
  .readdirSync(__dirname + "/commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once("ready", function () {
  console.log("Vettel is online!");
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(" ");

  const command = args.shift().toLowerCase();

  if (command === "hello" || command === "hi" || command === "hey") {
    client.commands.get("hello").execute(message, args);
  }

  if (command === "rule" || command === "rules") {
    client.commands.get("rules").execute(message, args);
  }

  if (command === "lastgp" || command === "recentgp") {
    client.commands.get("lastgp").execute(message, args);
  }
});

client.login("OTA2NTYxODAyMTMxODk0MzQy.YYabeA.r9gvz2j6rcFirVtrEKJHXs8q5SQ");
