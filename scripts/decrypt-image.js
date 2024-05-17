const {
  createPrivateKey,
  privateDecrypt,
  createDecipheriv,
} = require("node:crypto");
const { readFileSync, writeFileSync, existsSync } = require("node:fs");
const { Storage } = require("@google-cloud/storage");

const bucketName = process.env.BUCKET_NAME;

const passphrase = process.argv[2];
const fileName = process.argv[3];

const downloadPath = `./downloads/${fileName}`;
const bucketPath = `docs/${fileName}`;
const decryptedPath = `./decrypted/${fileName.split(".json")[0]}.jpeg`;

const downloadIfNecessary = async () => {
  if (existsSync(downloadPath)) {
    return;
  }
  const storage = new Storage();
  const options = {
    destination: downloadPath,
  };
  const response = await storage
    .bucket(bucketName)
    .file(bucketPath)
    .download(options);
  console.log("download response: ", response);
};

const action = async () => {
  downloadIfNecessary();
  const fileContent = readFileSync(downloadPath, "utf8");
  const jsonFile = JSON.parse(fileContent);
  const { cipherText, key, iv } = jsonFile.file;

  const privateKeyPem = readFileSync("./generated-private-key.pem");
  const privateKey = createPrivateKey({
    key: privateKeyPem,
    passphrase,
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
  });

  const aesKey = privateDecrypt(
    {
      key: privateKey,
      oaepHash: "sha256",
      passphrase,
    },
    Buffer.from(key, "base64")
  );
  const aesIV = privateDecrypt(
    {
      key: privateKey,
      oaepHash: "sha256",
      passphrase,
    },
    Buffer.from(iv, "base64")
  );

  const decipherTask = new Promise((res) => {
    const decipher = createDecipheriv("aes-256-cbc", aesKey, aesIV);
    let decrypted = "";
    decipher.on("readable", () => {
      let chunk;
      while (null !== (chunk = decipher.read())) {
        decrypted += chunk.toString("utf8");
      }
    });
    decipher.on("end", () => {
      res(decrypted);
    });
    decipher.write(cipherText, "base64");
    decipher.end();
  });
  const result = await decipherTask;

  const fileBase64Data = result.split("data:image/jpeg;base64,")[1];

  writeFileSync(decryptedPath, fileBase64Data, "base64");
  console.log("Decrypted file", decryptedPath);
};
action();
