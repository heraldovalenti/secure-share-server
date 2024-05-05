const { Storage } = require("@google-cloud/storage");

const { bucketName } = require("./constants");

const listFiles = async (req, res) => {
  res.set("Content-Type", "application/json");
  try {
    const storage = new Storage();
    const [response] = await storage.bucket(bucketName).getFiles();
    const files = response.map(({ name }) => ({
      name,
    }));
    res.status(200).send(JSON.stringify(files));
  } catch (e) {
    console.error(e);
    res.status(500).send(JSON.stringify({ e }));
  }
};

module.exports = { listFiles };
