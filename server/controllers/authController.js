const jwt = require("jsonwebtoken");
const Mentors = require("../models/mentorModel");
const Students = require("../models/studentModel");
const asyncHandler = require("../utils/asyncHandler");
const CustomError = require("../utils/customError");

exports.authorization = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const error = new CustomError("Invalid JWT Token", 401);
    next(error);
  }
  let authToken = null;
  authToken = authHeader.split(" ")[1];

  if (!authToken) {
    const error = new CustomError("Invalid JWT Token", 401);
    next(error);
  }

  jwt.verify(authToken, "vamsi", async (error, data) => {
    if(error){
      const error = new CustomError("Invalid JWT token",401)
      return next(error)
    }else{
    let user = await Students.findById(data.data._id)
    if(!user){
      user = await Mentors.findById(data.data._id)
    }

    if(!user){
      const error = new CustomError("User Not Found",404)
      return next(error)
    }
    req.user = user
    next();
  }
  });
});

const generateToken = (data) => {
  const token = jwt.sign({ data }, "vamsi");
  return token;
};

exports.createStudent = asyncHandler(async (req, res) => {
  let createAccount = null;
  if (req.body.role === "student") {
    createAccount = await Students.create(req.body);
  } else {
    createAccount = await Mentors.create(req.body);
  }

  res.status(201).json({
    status: "Success",
    message: "Account created successfully.Please go to login page",
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  let user = await Students.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) {
    user = await Mentors.findOne({ email: req.body.email }).select("+password");
  }

  if (!user) {
    const error = new CustomError("User not found. Please create an account",404)
    return next(error)
  }

  if (!(await user.comparePasswords(req.body.password, user.password))) {
    const error = new CustomError("Invalid password",401)
    return next(error)
  }

  const token = generateToken(user);

  res.status(200).json({
    status: "Success",
    message: "Logged in successfully",
    token,
    data: {
      user,
    },
  });
});
