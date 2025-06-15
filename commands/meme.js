const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const c = require("../config.js");
const q = require("../utils/quick.js");
const cd = new Set()
const CD_TIME = 5000

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meme")
    .setDescription("Chooses a random funny GIF"),

  async execute(i) {
    
    if (cd.has(i.user.id)) {
      return i.reply({
        content: `Chill, please wait few seconds before using this command again!`,
        flags: 64,
      });
    }

    function cd_wait(user) {
        cd.add(user)
        setTimeout(() => cd.delete(user), CD_TIME);
    }

    if (!c.tenorApiKey || c.tenorApiKey === "") {
      return q.cmd_disabled(i);
    }

    try {
      const res = await axios.get("https://tenor.googleapis.com/v2/search", {
        params: {
          key: c.tenorApiKey,
          q: "memes",
          limit: 25,
          media_filter: "minimal",
          contentfilter: "high",
          random: true
        }
      });

      const results = res.data.results;
      if (!results || results.length === 0) {
        return i.reply({
          content: "Ehhh, I couldn't find any memes 🫤",
          flags: 64,
        });
      }

      const gifUrl = results[Math.floor(Math.random() * results.length)].media_formats.gif.url;

      if (c.memesVisible === "private") {
        await i.reply({
          content: gifUrl,
          flags: 64,
        });
        cd_wait(i.user.id)
      } else if (c.memesVisible === "public") {
        await i.reply(gifUrl);
        cd_wait(i.user.id)
      } else {
        await i.reply({
          content: "Oh, the owner **hasn't** set the **correct type** for this command!\nPlease **report** this as **quickly** as possible!",
          flags: 64,
        });
        cd_wait(i.user.id)
      }

    } catch (err) {
      console.error(`❌ Error at /${this.data.name}\n${err}`);
      await i.reply({
        content: "Ehhhh, Something went wrong while fetching the meme",
        flags: 64,
      });
      cd_wait(i.user.id)
    }
  }
};
