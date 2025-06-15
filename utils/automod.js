const c = require("../config");
const aml = c.aml_bw;

function cfam(msg) {
  const lower = msg.toLowerCase();
  for (const bw of aml) {
    if (lower.includes(bw)) {
      return `blocked,${bw}`;
    }
  }
  return "allowed";
}

module.exports = { cfam };
