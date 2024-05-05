const express = require("express");
var cors = require("cors");

const { uploadFile } = require("./uploadFile");
const { listFiles } = require("./listFiles");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/uploadFile", uploadFile);
app.get("/listFiles", listFiles);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
