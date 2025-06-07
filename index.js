const { Client, GatewayIntentBits, Partials, Collection, REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const config = require("./config");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

const localCommands = [];

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
    localCommands.push(command.data.toJSON());
  } else {
    console.warn(`⚠️ [WARNING] Command at ${filePath} is missing required "data" or "execute" property.`);
  }
}

console.log(`⭐ Loaded ${client.commands.size} commands.`);

client.once("ready", async () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    let route;

    if (config.LOAD_ONLY_ON_GUILD) {
      route = Routes.applicationGuildCommands(client.user.id, config.GUILD_ID);
      console.log("📍 GUILD COMMANDS ONLY [ACTIVE]");
    } else {
      route = Routes.applicationCommands(client.user.id);
      console.log("🌐 GLOBAL COMMANDS [ACTIVE]");
    }

    const currentCommands = await rest.get(route);

    await Promise.all(currentCommands.map(cmd => rest.delete(`${route}/${cmd.id}`)));

    await rest.put(route, { body: localCommands });

    console.log(`✅ Removed old commands and registered ${localCommands.length} new slash commands.`);
  } catch (err) {
    console.error("❌ Failed to register commands:\n", err);
  }
});

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

console.log("💻 Source code made by: Raynixx x Kerix with ❤️");

client.login(process.env.TOKEN);
