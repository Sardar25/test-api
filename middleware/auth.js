const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const User = require('../models/userModel');
const ErrorResponse = require('../utils/ErrorResponse');

exports.protect = asyncHandler(async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(new ErrorResponse('not authorize to access this route',401));
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        req.user = await User.findById(decoded.id);
        next();
    }catch(error){
        return next(new ErrorResponse('not authorize to access this route',401));

    }
});

exports.authorize = (...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
        return next(new ErrorResponse('not authorize to access this route',401));
    }
  next();

  }
}

