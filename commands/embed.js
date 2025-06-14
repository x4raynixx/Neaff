const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const q = require("../utils/quick");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription("[Admin] Sends a customized Embed or JSON embed file")
    .addStringOption(option =>
      option.setName("title")
        .setDescription("The title of the embed (Required if no file)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("description")
        .setDescription("The description of the embed (Required if no file)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("footer")
        .setDescription("The footer of the embed (Optional)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("color")
        .setDescription("The color of the embed [HEX] (Optional)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("thumbnail")
        .setDescription("Thumbnail URL (Optional)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("image")
        .setDescription("Image URL (Optional)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("author")
        .setDescription("Author name (Optional)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("author_icon")
        .setDescription("Author icon URL (Optional)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("field_name")
        .setDescription("Field name (Optional)")
        .setRequired(false))
    .addStringOption(option =>
      option.setName("field_value")
        .setDescription("Field value (Optional)")
        .setRequired(false))
    .addAttachmentOption(option =>
      option.setName("file")
        .setDescription("Upload a JSON file with an embed")
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    if (await q.check_if_server(interaction)) return;
    if ((await q.check_perms("admin", interaction)) === "NO") return;

    const file = interaction.options.getAttachment("file");

    function parseField(str) {
      if (!str) return { text: null, timestamp: false };
      if (str.includes("Date.now")) {
        return { text: str.replace(/Date\.now/g, "").trim(), timestamp: true };
      }
      return { text: str, timestamp: false };
    }

    if (file) {
      if (!file.name.endsWith(".json")) {
        return interaction.reply({ content: "Oops, you can only Upload JSON Files!", flags: 64 });
      }
      const fetch = require("node-fetch");
      const response = await fetch(file.url);
      const json = await response.json().catch(() => null);
      if (!json) return interaction.reply({ content: "Uh-oh, i Somehow can't read this embed", flags: 64 });

      if (!json.embeds || !Array.isArray(json.embeds) || json.embeds.length === 0) {
        return interaction.reply({ content: "Hey, this JSON File doesn't contain an embed", flags: 64 });
      }

      const embedData = json.embeds[0];
      const embed = new EmbedBuilder(embedData);

      return interaction.reply({ content: json.content || null, embeds: [embed] });
    }

    const titleInput = interaction.options.getString("title");
    const descInput = interaction.options.getString("description");

    if (!titleInput || !descInput) {
      return interaction.reply({ content: "Hey, please provide either a title and description, or a full embed", flags: 64 });
    }

    const embed = new EmbedBuilder();
    let timestampSet = false;

    const title = parseField(titleInput);
    if (title.text) embed.setTitle(title.text);
    if (title.timestamp) timestampSet = true;

    const description = parseField(descInput);
    if (description.text) embed.setDescription(description.text);
    if (description.timestamp) timestampSet = true;

    const footerInput = interaction.options.getString("footer");
    if (footerInput) {
      const footer = parseField(footerInput);
      if (footer.text) embed.setFooter({ text: footer.text });
      if (footer.timestamp) timestampSet = true;
    }

    const colorInput = interaction.options.getString("color");
    if (colorInput) {
      try {
        embed.setColor(colorInput);
      } catch {}
    }

    const thumbnailInput = interaction.options.getString("thumbnail");
    if (thumbnailInput) embed.setThumbnail(thumbnailInput);

    const imageInput = interaction.options.getString("image");
    if (imageInput) embed.setImage(imageInput);

    const authorInput = interaction.options.getString("author");
    const authorIconInput = interaction.options.getString("author_icon");
    if (authorInput) {
      const author = parseField(authorInput);
      if (authorIconInput) {
        embed.setAuthor({ name: author.text || "", iconURL: authorIconInput });
      } else {
        embed.setAuthor({ name: author.text || "" });
      }
      if (author.timestamp) timestampSet = true;
    }

    const fieldNameInput = interaction.options.getString("field_name");
    const fieldValueInput = interaction.options.getString("field_value");
    if (fieldNameInput && fieldValueInput) {
      const fieldName = parseField(fieldNameInput);
      const fieldValue = parseField(fieldValueInput);
      embed.addFields({ name: fieldName.text || "\u200B", value: fieldValue.text || "\u200B" });
      if (fieldName.timestamp || fieldValue.timestamp) timestampSet = true;
    }

    if (timestampSet) embed.setTimestamp();

    await interaction.channel.send({ embeds: [embed] });
    await interaction.reply({ content: "Done!", flags: 64 });
  }
};
