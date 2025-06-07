const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription('Rozpoczyna giveaway (losowanie z reakcją 🎉)')
    .addStringOption(option =>
      option.setName('czas')
        .setDescription('Czas trwania (np. 10s, 5m, 1h, 2d)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('nagroda')
        .setDescription('Opis nagrody')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages), // tylko dla adminów

  async execute(interaction) {
    const czas = interaction.options.getString('czas');
    const nagroda = interaction.options.getString('nagroda');

    const ms = parseCzas(czas);
    if (!ms) {
      return interaction.reply({
        content: '❌ Błędny format czasu! Użyj np. `10s`, `5m`, `1h`, `2d`.',
        ephemeral: true,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('🎉 GIVEAWAY 🎉')
      .setDescription(`Nagroda: **${nagroda}**\nKliknij 🎉 aby wziąć udział!\n⏰ Czas trwania: \`${czas}\``)
      .setColor('Random')
      .setFooter({ text: `Zakończenie za ${czas}` })
      .setTimestamp(Date.now() + ms);

    const msg = await interaction.reply({ embeds: [embed], fetchReply: true });
    await msg.react('🎉');

    setTimeout(async () => {
      try {
        const fetchedMsg = await interaction.channel.messages.fetch(msg.id);
        const reaction = fetchedMsg.reactions.cache.get('🎉');
        if (!reaction) {
          return interaction.followUp('❌ Giveaway zakończony, brak reakcji.');
        }

        const users = await reaction.users.fetch();
        const uczestnicy = users.filter(u => !u.bot);

        if (uczestnicy.size === 0) {
          return interaction.followUp('❌ Giveaway zakończony. Nikt nie wziął udziału.');
        }

        const winner = uczestnicy.random();
        await interaction.followUp(`🎉 Gratulacje <@${winner.id}>! Wygrałeś/aś **${nagroda}**!`);
      } catch (err) {
        console.error('❌ Błąd giveaway:', err);
        await interaction.followUp('❌ Coś poszło nie tak przy losowaniu.');
      }
    }, ms);
  },
};
