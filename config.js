const getBot = require("./utils/getBot")
const q = require("./utils/quick")

module.exports = {
  BOT_NAME: "Neaff",
  LOAD_ONLY_ON_GUILD: true, // If true the commands will be only available on the Server with the id below!
  GUILD_ID: "1361866150966722723",

  // Tenor Api for memes (Optional)
  tenorApiKey: "", // If you don't have an Tenor Api Key leave it blank
  memesVisible: "private", // If private the user will only see this GIF, Available: private, public

  // Clear command
  TIME_BEFORE_OWN_MESSAGE_DELETE: 3000, // Time in milliseconds (ms) before the bot deletes his own message with the shown amount of how much messages he deleted.

  //
  aml_bw: q.gbwl(),

  // Enable/Disable Commands | True = enabled
  PING_COMMAND: false,
  CLEAR_COMMAND: true,
  ABOUT_US_COMMAND: true,
  EMBED_COMMAND: true,

  // Messages
  PING_PONG_REPLY: "👋 Pong!",
  // ABOUT_US_DESCRIPTION: To set the description of /about slash command head over to about.js command in folder commands!
};
