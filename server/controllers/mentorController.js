const Mentors = require("../models/mentorModel");
const Students = require("../models/studentModel")
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");


exports.getAllMentorsList = asyncHandler(async(req,res,next)=>{
  let mentors = await Mentors.find({})

  if(!mentors){
    const error = new CustomError("No Mentors Found",404)
    return next(error)
  }

  res.status(200).json({
    status:"Success",
    data:{
      mentors
    }
  })
})