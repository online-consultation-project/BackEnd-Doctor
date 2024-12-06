const mongoose = require("mongoose");

function connect() {
  try {
    mongoose
    .connect(
      "mongodb+srv://sri715565:project@cluster0.1n5t2.mongodb.net/projectdb?retryWrites=true&w=majority&appName=Cluster0"
    )
   console.log("Database Connected...")
  
  } catch (error) {
   console.log(err);
  }
 
}

module.exports = connect;
