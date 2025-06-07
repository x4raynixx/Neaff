const { SlashCommandBuilder } = require("discord.js")
const config = require("../config")

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

function cstate(name, int) {
    if (!config + "." + name) {
        cmd_disabled(int)
        return "OK"
    } else {
        return "NO"
    }
}

function check_if_server(interaction) {
  if (!interaction.guild) {
    interaction.reply({
      content: "Hey! This command can only be used in a server!",
      flags: 64,
    });
    return true;
  }
  return false;
}


module.exports = {
    cmd_disabled,
    no_perms,
    check_perms,
    cstate,
    check_if_server,
}
