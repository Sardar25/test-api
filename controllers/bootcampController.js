const Bootcamp = require("../models/bootcampModel");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/courseModel");
const path = require('path')

exports.getBootcamps = asyncHandler(async (req, res, next) => {

   const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 100;
  const skip = (page-1) * limit;
  const total = await Bootcamp.countDocuments();

  const bootcamps = await Bootcamp.find().populate('courses');




  res.status(200).json({
    success: true,
    count: total,
    data: bootcamps,
  });
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {

 req.body.user = req.user.id;
 const publishedBootcamps = await Bootcamp.findOne({ user:req.user.id });

 if(publishedBootcamps && req.user.role!=='admin'){
    return next(new ErrorResponse(`User already published a bootcamp`, 400));
 }
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404));
  }

  if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`Permission denied`, 401));
  }

    bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: bootcamp,
  });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
    );
  }

 if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
    return next(new ErrorResponse(`Permission denied`, 401));
  }

   await Course.deleteMany({ bootcamp: bootcamp._id });

  await Bootcamp.deleteOne({_id:bootcamp._id});

  res.status(200).json({
    success: true,
    data: {},
  });
});


exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
    );
  }

   if (!req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }

  const file = req.files.file;


  if(!file.mimetype.startsWith('image')) {
    return next(
      new ErrorResponse(`Please upload an image file`, 400)
    ); 
  }

 if(!file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`Please upload an image file less than ${process.env.MAX_FILE_UPLOAD}`, 400)
    ); 
  }

  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if(err){
      return next(
       new ErrorResponse(`Error while uploading image`, 500)
      );
    }
    await Bootcamp.findByIdAndUpdate(req.params.id, { photo:file.name } )
  })
 

  res.status(200).json({
    success: true,
    data: file.name,
  });
});