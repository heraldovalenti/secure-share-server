/**
 * References:
 * - https://stackoverflow.com/questions/66423321/node-crypto-publicencrypt-returns-different-value-each-time-it-is-used
 * - https://nodejs.org/api/crypto.html#cryptocreatepublickeykey
 * - https://gist.github.com/QingpingMeng/f51902e2629fc061c6b9fc9bb0f3f57b
 */

const { createPublicKey, publicEncrypt } = require("node:crypto");
const { readFileSync } = require("node:fs");

const message = process.argv[2];

const publicKeyPem = readFileSync("./generated-public-key.pem");
const publicKey = createPublicKey(publicKeyPem);

const cipherText = publicEncrypt(
  {
    key: publicKey,
    oaepHash: "sha256",
  },
  message
);
// console.log(cipherText);
// console.log(cipherText.toString("utf8"));
console.log(cipherText.toString("base64"));
