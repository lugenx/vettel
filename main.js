const { Client, Intents, Message } = require("discord.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const prefix = "/";

client.once("ready", function () {
  console.log("f1b bot is now online");
});

client.on("message", function (message) {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }
});

client.login("OTA2NTYxODAyMTMxODk0MzQy.YYabeA.r9gvz2j6rcFirVtrEKJHXs8q5SQ");
