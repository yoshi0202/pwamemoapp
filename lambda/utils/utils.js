const crypto = require("crypto");

function getTimestamp() {
  return Math.floor(new Date().getTime() / 1000);
}

function getRandomToken(N) {
  return crypto
    .randomBytes(N)
    .toString("base64")
    .substring(0, N);
}

function createDefaultUserId() {
  const crypto = require("crypto");
  const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const N = 16;
  return Array.from(crypto.randomFillSync(new Uint8Array(N)))
    .map(n => S[n % S.length])
    .join("");
}
function createSnipId() {
  const crypto = require("crypto");
  const S = "abcdefghijklmnopqrstuvwxyz0123456789";
  const N = 10;
  return Array.from(crypto.randomFillSync(new Uint8Array(N)))
    .map(n => S[n % S.length])
    .join("");
}
module.exports = {
  getTimestamp: getTimestamp,
  getRandomToken: getRandomToken,
  createDefaultUserId: createDefaultUserId,
  createSnipId: createSnipId
};
