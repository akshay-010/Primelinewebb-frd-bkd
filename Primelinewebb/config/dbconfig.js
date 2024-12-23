const mongoose=require("mongoose")

module.exports={dbconfig:async()=>{
    try{await mongoose.connect('mongodb://localhost:27017/primeline').then(()=>{console.log('Database Connected')})}

    catch(Error){console.log(Error)}


}}

