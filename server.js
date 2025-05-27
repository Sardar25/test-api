const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/dbConfig');
const fileUpload = require('express-fileupload');
const path = require('path');
const cookieParser = require('cookie-parser');
//load enviroment variables
dotenv.config({ path:'./config/config.env' });
const cors = require('cors');

//connnect datbase
connectDB();

// import route files 
const bootcampRouter = require('./routes/bootcampRoutes');
const courseRouter = require('./routes/courseRoutes');
const authRouter = require('./routes/authRoute');


const errorHandler = require('./middleware/error');



const app = express();

 

app.use(express.json());
app.use(cookieParser());
// logger middleware (dev) 
if(process.env.NODE_ENV == 'development'){
app.use(morgan('dev'));
}

app.use(fileUpload());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));
// mount routes
app.use('/api/v1/bootcamps',bootcampRouter);
app.use('/api/v1/courses',courseRouter);
app.use('/api/v1/auth',authRouter);

app.get('/',(req,res)=>res.json({message:'hello'}));

//error handler middleware
app.use(errorHandler);

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT,console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));

process.on('unhandledRejection',(error,promise)=>{
    console.log(`error: ${error}`);
    server.close(()=> process.exit(1));
})