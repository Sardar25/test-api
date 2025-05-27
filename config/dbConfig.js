const mongoose = require('mongoose');

const connectDB = async ()=>{
  try{

    const connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongodb connected ${connect.connection.host}`);
  }
  catch(e){
    console.log('error: ',e)
  }
}

module.exports = connectDB;