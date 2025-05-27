const Course = require('../models/courseModel');
const Bootcamp = require('../models/bootcampModel');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require("../utils/ErrorResponse");


exports.getCourses = asyncHandler(async (req,res,next)=>{
    let query;
    if(req.params.bootcampId){
        query = Course.find({ bootcamp: req.params.bootcampId });
    }
    else{
        query = Course.find();
    }
    const courses = await query;
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
})

exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({ path:'bootcamp', select:'name description' });
  if (!course) {
    return next(
      new ErrorResponse(`Course with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`bootcamp with id ${req.params.id} not found`, 404)
    );
  }

  req.body.bootcamp = req.params.bootcampId;
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.updateCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return next(
      new ErrorResponse(`course with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`course with id ${req.params.id} not found`, 404)
    );
  }


  await Course.deleteOne({_id:course._id});

  res.status(200).json({
    success: true,
    data: {},
  });
});
