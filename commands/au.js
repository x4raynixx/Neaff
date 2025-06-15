const { SlashCommandBuilder } = require("discord.js");
const q = require("../utils/quick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("au")
    .setDescription("[Admin] Manage the AutoMod blacklist")
    .addStringOption(option =>
      option
        .setName("word")
        .setDescription("The word to add or remove")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("action")
        .setDescription("Choose whether to add or remove the word")
        .setRequired(true)
        .addChoices(
          { name: "Add", value: "+" },
          { name: "Remove", value: "-" }
        )
    ),

  async execute(interaction) {
    const perm = await q.check_perms("admin", interaction);
    if (perm === "NO") return;

    const word = interaction.options.getString("word");
    const action = interaction.options.getString("action");

    if (!word || !action) {
      return interaction.reply({
        content: "Oops! You need to provide both a word and an action (add or remove).",
        flags: 64,
      });
    }

    const result = q.ubwl(word, action);

    if (result === "OK") {
      return interaction.reply({
        content: `Great! The word \`${word}\` has been successfully ${action === "+" ? "added to" : "removed from"} the blacklist!`,
        flags: 64,
      });
    } else if (result === "ALREADY_ON_LIST") {
      return interaction.reply({
        content: `Heads up! The word \`${word}\` is already on the blacklist.`,
        flags: 64,
      });
    } else if (result === "NOT_FOUND") {
      return interaction.reply({
        content: `Hmm, I couldn't find the word **${word}** on the blacklist.`,
        flags: 64,
      });
    } else if (result === "INVALID_TYPE") {
      return interaction.reply({
        content: "Oops! The action you provided isn't valid. Please choose 'add' or 'remove'.",
        flags: 64,
      });
    } else {
      return interaction.reply({
        content: "Uh-Oh, Something went wrong, please try again later.",
        flags: 64,
      });
    }
  }
};
