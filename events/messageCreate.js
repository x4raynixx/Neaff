const { Events } = require('discord.js');
const aml_bw = require("../config");
const am = require("../utils/automod");
const q = require("../utils/quick")

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    let cfam = await am.cfam(message.content);

    if (cfam.includes("blocked")) {
      let b = await message.reply({
        content: `Hey, your message was blocked because of blocked content!\nYou wrote: \`${cfam.split(",")[1].trim() || cfam}\``,
        flags: 64,
      });
      await message.delete();
      q.w(3000, () => {
        b.delete().catch(() => {});
      });
    }
  },
};
