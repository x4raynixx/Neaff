const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, User } = require("discord.js");
const config = require("../config");
const q = require("../utils/quick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear provided amount of messages")
    .addStringOption(option =>
      option
        .setName("amount")
        .setDescription("How many messages to clear?")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
        if (!config.CLEAR_COMMAND) {
          return q.cmd_disabled(interaction);
        }

    await q.check_perms()

    const amount = parseInt(interaction.options.getString("amount"));

    if (amount > 100) {
      return interaction.reply({
        content: "Wooaahh the number you provided is too **high**, please provide a number from 1 to 100!",
        flags: 64,
      });
    } else if (amount < 1) {
      return interaction.reply({
        content: "Wooaahh the number you provided is too **low**, please provide a number from 1 to 100!",
        flags: 64,
      });
    }

    try {
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      const deletedMessages = await interaction.channel.bulkDelete(messages, true).catch(() => new Map());
      const notDeleted = messages.filter(msg => !deletedMessages.has(msg.id));
      for (const [, msg] of notDeleted) {
        try {
          await msg.delete();
        } catch {}
      }

      const embed = new EmbedBuilder()
        .setTitle("🧹 | Cleared")
        .setDescription(`Successfully deleted \`${messages.size}\` messages`)
        .setColor("#0087ff")
        .setFooter(`${config.BOT_NAME} | Clear`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      const reply = await interaction.fetchReply();

      setTimeout(() => {
        reply.delete().catch(() => {});
      }, config.TIME_BEFORE_OWN_MESSAGE_DELETE - 1000);

    } catch (error) {
      return interaction.reply({
        content: "Hmm... I couldn't delete some messages. They might be older than 14 days or I might need a few more permissions to do that!",
        flags: 64,
      });
    }
  },
};
