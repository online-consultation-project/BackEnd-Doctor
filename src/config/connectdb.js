const mongoose = require("mongoose");
require("dotenv").config();

function connect() {
  try {
    mongoose.connect(process.env.DATABASE_CLUSTER_ID);
    console.log("Database Connected...");
  } catch (error) {
    console.log(err);
  }
}

module.exports = connect;
