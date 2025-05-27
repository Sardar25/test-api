const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path:'./config/config.env' });

const Bootcamp = require('./models/bootcampModel');
const Course = require('./models/courseModel');
const User = require('./models/userModel');


mongoose.connect(process.env.MONGO_URI);


const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,'utf-8'));
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,'utf-8'));



const importData = async ()=> {
    try{
        await User.create(users);
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Bootcamps created');
        process.exit();
    }catch(error){
         console.log('error : ',error)
    }
}
const deleteData = async ()=> {
    try{
        await User.deleteMany();
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Bootcamps deleted');
        process.exit();

    }catch(error){
         console.log('error : ',error)
    }
}

if(process.argv[2] == '-i'){
    importData();
}
else if(process.argv[2] == '-d'){
     deleteData();
}
