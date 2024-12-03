const express = require("express");
const connection = require("./config/connectdb");
const superRouter = require("./routes/superAdmin.route")
const adminRouter = require("./routes/admin.route")

require("dotenv").config();
const cors = require("cors");

const app = express();

const port = 7000;

app.use(cors("*"));
app.use(express.json());
connection();

app.use("/super", superRouter);
app.use("/admin", adminRouter);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
