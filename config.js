const getBot = require("./utils/getBot")

module.exports = {
  BOT_NAME: "Neaff",
  LOAD_ONLY_ON_GUILD: true, // If true the commands will be only available on the Server with the id below!
  GUILD_ID: "",

  // Clear command
  TIME_BEFORE_OWN_MESSAGE_DELETE: 3000, // Time in milliseconds (ms) before the bot deletes his own message with the shown amount of how much messages he deleted.

  // Enable/Disable Commands | True = enabled
  PING_COMMAND: false,
  CLEAR_COMMAND: true,
  ABOUT_US_COMMAND: true,
  EMBED_COMMAND: true,

  // Messages
  PING_PONG_REPLY: "👋 Pong!",
  // ABOUT_US_DESCRIPTION: To set the description of /about slash command head over to about.js command in folder commands!
};
