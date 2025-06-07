const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if the bot is alive'),

    async execute(interaction) {
        await interaction.reply({ content: '👋 Pong!', flags: 64});
    }
};