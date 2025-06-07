const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, Embed, PermissionFlagsBits } = require("discord.js")
const q = require("../utils/quick")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("[Admin] Sends a customized Embed")
        .addStringOption(option => option
            .setName("title")
            .setDescription("The title of the embed (Required)")
            .setRequired(true)
        )
            .addStringOption(option => option
            .setName("description")
            .setDescription("The description of the embed (Required)")
            .setRequired(true)
        )
            .addStringOption(option => option
            .setName("footer")
            .setDescription("The footer of the embed (Optional)")
            .setRequired(false)
        )
            .addStringOption(option => option
            .setName("color")
            .setDescription("The color of the embed [HEX] (Optional)")
            .setRequired(false)
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const req = await q.check_if_server(interaction);
        if (req) return;
        await q.check_perms()

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.options.getString("title")}`)
            .setDescription(`${interaction.options.getString("description")}`)

        const footer = interaction.options.getString("footer");
        if (footer) embed.setFooter({ text: footer });

        const color = interaction.options.getString("color");
        if (color) embed.setColor(color);

        await interaction.channel.send({
            embeds: [embed]
        });

        interaction.reply({
            content: "Done!",
            flags: 64,
        })
    }
}