const { Storage } = require("@google-cloud/storage");

const { bucketName } = require("./constants");

const uploadFile = async (req, res) => {
  const { body } = req;
  res.set("Content-Type", "application/json");
  try {
    const date = new Date().toISOString();
    const destFileName = `docs/${date}.json`;
    const storage = new Storage();
    await storage
      .bucket(bucketName)
      .file(destFileName)
      .save(JSON.stringify(body));
    res.status(200).send(JSON.stringify({ destFileName }));
  } catch (e) {
    console.error(e);
    res.status(500).send(JSON.stringify({ e }));
  }
};

module.exports = { uploadFile };
