module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Error at /${interaction.commandName}:\n`, error);
      await interaction.reply({ content: "Uh, something went wrong, please contact the owner!", ephemeral: true });
    }
  },
};
