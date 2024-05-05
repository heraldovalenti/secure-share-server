/**
 * References:
 * - https://stackoverflow.com/questions/66423321/node-crypto-publicencrypt-returns-different-value-each-time-it-is-used
 * - https://nodejs.org/api/crypto.html#cryptocreatepublickeykey
 * - https://gist.github.com/QingpingMeng/f51902e2629fc061c6b9fc9bb0f3f57b
 */

const { createPrivateKey, privateDecrypt } = require("node:crypto");
const { readFileSync } = require("node:fs");

const passphrase = process.argv[2];
const cipherTextBase64 = process.argv[3];
const cipherText = Buffer.from(cipherTextBase64, "base64");

const privateKeyPem = readFileSync("./generated-private-key.pem");
const privateKey = createPrivateKey({
  key: privateKeyPem,
  passphrase,
  type: "pkcs8",
  format: "pem",
  cipher: "aes-256-cbc",
});
// console.log(privateKey.export({ format: "pem", type: "pkcs8" }));
const plainText = privateDecrypt(
  {
    key: privateKey,
    oaepHash: "sha256",
    passphrase,
  },
  cipherText
);

console.log(plainText.toString("utf8"));
// console.log(plainText);
// console.log(plainText.toString("base64"));
