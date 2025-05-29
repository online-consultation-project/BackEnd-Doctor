const mongoose=require("mongoose");

function connect(){
mongoose.connect(process.env.DATABASE_CLUSTER_ID)
.then(()=>{
    console.log("MongoDB Connected......");   
})
.catch((err)=>{
console.log(`Connection Error ${err}`);
});
}

module.exports = connect;
