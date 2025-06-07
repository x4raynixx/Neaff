const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config");
const q = require("../utils/quick");

const descAbout = [
  `> 🤖 Bot | \`${config.BOT_NAME}\``,
  ">",
  `> 💖 Made with love by \`Raynixx\` and \`Kerix\``,
  "> 📬 Contact: [raynixx@example.com](mailto:raynixx@example.com), [kerix@example.com](mailto:kerix@example.com)",
  "> 🔗 Socials: [Twitter](https://twitter.com/yourhandle) | [GitHub](https://github.com/yourrepo)",
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
            .setTimestamp()

        await interaction.reply({ embeds: [about], flags: 64 });
    }
}
