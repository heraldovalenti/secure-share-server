const { generateKeyPairSync } = require("node:crypto");
const { writeFileSync } = require("node:fs");

const passphrase = process.argv[2];

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase,
  },
});
writeFileSync("generated-private-key.pem", privateKey);
writeFileSync("generated-public-key.pem", publicKey);
