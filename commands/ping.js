const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const config = require("../config");
const q = require("../utils/quick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if the bot is alive'),

    async execute(interaction) {
    if (!config.PING_COMMAND) {
      return q.cmd_disabled(interaction);
    }
        await interaction.reply({ content: '👋 Pong!', flags: 64});
    }
};