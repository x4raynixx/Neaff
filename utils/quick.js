const { SlashCommandBuilder } = require("discord.js");
const config = require("../config");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const dtuPath = path.join(__dirname, "../storage/automod.json");

function cmd_disabled(interaction) {
  return interaction.reply({
    content: "Uh-oh, it seems like this command is disabled!",
    flags: 64,
  });
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

function cstate(name, i) {
  if (!config + "." + [name]) {
    return "OK";
  } else {
    return "NO";
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

function w(ms, cb) {
  setTimeout(cb, ms);
}

function ubwl(nw, type) {
  if (!nw || typeof nw !== "string") return;

  let data = JSON.parse(fs.readFileSync(dtuPath, "utf-8"));
  if (!Array.isArray(data.bw)) data.bw = [];

  if (type === "+") {
    if (!data.bw.some(word => word.toLowerCase() === nw.toLowerCase())) {
      data.bw.push(nw);
      fs.writeFileSync(dtuPath, JSON.stringify(data, null, 2), "utf-8");
      return "OK";
    } else {
      return "ALREADY_ON_LIST";
    }
  } else if (type === "-") {
    const index = data.bw.findIndex(word => word.toLowerCase() === nw.toLowerCase());
    if (index !== -1) {
      data.bw.splice(index, 1);
      fs.writeFileSync(dtuPath, JSON.stringify(data, null, 2), "utf-8");
      return "OK";
    } else {
      return "NOT_FOUND";
    }
  } else {
    return "INVALID_TYPE";
  }
}

function gbwl() {
  let data = JSON.parse(fs.readFileSync(dtuPath, "utf-8"));
  return data.bw;
}

module.exports = {
  cmd_disabled,
  no_perms,
  check_perms,
  cstate,
  check_if_server,
  w,
  ubwl,
  gbwl,
};
