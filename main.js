import { Client, Intents, Collection } from "discord.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import {} from "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const prefix = "+";

import { readdirSync } from "fs";
client.commands = new Collection();

//commandFiles is an array of directory files

client.once("ready", async () => {
  console.log("Vettel is now online!");
  try {
    const commandFiles = readdirSync(__dirname + "/commands").filter((file) =>
      file.endsWith(".mjs")
    );
    commandFiles.map(async (file) => {
      const command = await import(`./commands/${file}`);
      const { name } = await command;

      client.commands.set(name, command);
    });
  } catch (err) {
    console.error(err);
  }
});

client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) {
    return;
  }

  const args = message.content.slice(prefix.length).split(" ");

  const command = args.shift().toLowerCase();

  if (command === "help") {
    client.commands.get("help").execute(message, args);
  }

  if (command === "why") {
    client.commands.get("why").execute(message, args);
  }

  if (command === "hello" || command === "hi" || command === "hey") {
    client.commands.get("hello").execute(message, args);
  }

  if (command === "rule" || command === "rules") {
    client.commands.get("rules").execute(message, args);
  }

  if (command === "last" || command === "latest" || command === "recent") {
    client.commands.get("last").execute(message, args);
  }

  if (command === "embed") {
    client.commands.get("embed").execute(message, args);
  }

  if (command === "result" || command === "results" || command === "race") {
    client.commands.get("result").execute(message, args);
  }

  if (command === "podium") {
    client.commands.get("podium").execute(message, args);
  }

  if (command === "winner") {
    client.commands.get("winner").execute(message, args);
  }

  if (command === "qualifying" || command === "quali") {
    client.commands.get("qualifying").execute(message, args);
  }

  if (command === "wdc" || command === "champion" || command === "champ") {
    client.commands.get("wdc").execute(message, args);
  }

  if (
    command === "standings" ||
    command === "standing" ||
    command === "stand"
  ) {
    client.commands.get("standings").execute(message, args);
  }

  if (
    command === "schedule" ||
    command === "program" ||
    command === "calendar" ||
    command === "cal"
  ) {
    client.commands.get("schedule").execute(message, args);
  }
});

client.login(process.env.BOT_TOKEN);
