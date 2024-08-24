const Mentors = require("../models/mentorModel");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

exports.getMentorFromExpertise=asyncHandler(async(req,res,next)=>{
  const { search } = req.query;
  let mentors = null

  if (search) {
    mentors = await Mentors.find({
      areaOfExpertise: {
        $regex: new RegExp(search, "i")
      }
    });
  }else{
    mentors = await Mentors.find({})
  }

  

  if (mentors.length === 0) {
    return next(new CustomError("No mentors found with the specified area of expertise", 404));
  }

  res.status(200).json({
    status: "Success",
    results: mentors.length,
    data: {
      mentors
    }
  });
})