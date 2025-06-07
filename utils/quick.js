const { SlashCommandBuilder } = require("discord.js")

function cmd_disabled(interaction) {
    return interaction.reply({
        content: "Uh-oh, it seems like this command is disabled!",
        flags: 64,
    })
}

async function no_perms(interaction) {
  return interaction.reply({
    content: "Oh, it seems like you don't have permission to use this command!",
    flags: 64,
  });
}

async function check_perms(p, interaction) {
  if (p === "admin") {
    if (!interaction.member.permissions.has("Administrator")) {
      no_perms(interaction);
      return "NO";
    } else {
      return "OK";
    }
  }
  return "OK";
}

module.exports = {
    cmd_disabled,
    no_perms,
    check_perms,
}
