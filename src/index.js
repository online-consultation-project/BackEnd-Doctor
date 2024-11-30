const express = require("express");
const connection = require("./config/connectdb");

require("dotenv").config();
const cors = require("cors");

const app = express();

const port = 7000;

app.use(cors("*"));
app.use(express.json());
connection();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
