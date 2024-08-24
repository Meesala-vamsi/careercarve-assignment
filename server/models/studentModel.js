const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")

const studentSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Name field is required"]
  },
  email:{
    type:String,
    validate:[
      validator.isEmail,"Invalid Email"
    ],
    required:[true,"Email Field is Required."],
    unique:true
  },
  password:{
    type:String,
    required:[true,"Password field is required"],
    select:false
  },
  role:{
    type: String,
    enum: ['student',"Student"], 
    required: true,
  },
  availability: [
    {
      startTime: {
        type: Date,
        default:new Date()
      },
      endTime: {
        type: Date,
        default:new Date()
      },
    },Object
  ],
  areasOfInterest:{
    type:Array,
    default:["Health"]
  }

},{timestamps:true})

studentSchema.methods.comparePasswords= async function(pass,passDB){
  return await bcrypt.compare(pass,passDB)
}

studentSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()

   this.password = await bcrypt.hash(this.password,10) 
})

const Students = mongoose.model("Students",studentSchema)

module.exports = Students