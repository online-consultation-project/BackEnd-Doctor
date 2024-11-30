const mongoose = require('mongoose')

function connect(){
    mongoose.connect("mongodb+srv://sri715565:project@cluster0.1n5t2.mongodb.net/projectdb?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err));
}

module.exports = connect

