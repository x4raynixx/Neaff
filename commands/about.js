const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const config = require("../config");

const descAbout = [
  `> 🤖 Bot - \`${config.BOT_NAME}\``,
  "> ",
  `> 💖 | Made with **love** by \`Raynixx\` and \`Kerix\``,
  "> ⭐ | GitHub Project: https://github.com/x4raynixx/Neaff",
  `> 🔗 | Socials: [YouTube](https://youtube.com/@4Raynixx) | [GitHub](https://github.com/x4raynixx/)`,
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About the creators of Neaff"),
  async execute(interaction) {
    const about = new EmbedBuilder()
      .setTitle("⭐ | About us")
      .setDescription(descAbout.join("\n"))
      .setColor("DarkBlue")
      .setTimestamp();

    await interaction.reply({ embeds: [about], flags: 64 });
  },
};
