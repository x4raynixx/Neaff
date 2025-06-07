const { SlashCommandBuilder } = require("discord.js")
const config = require("../config");

function name() {
    return config.BOT_NAME
}

module.exports = {
    name,
}