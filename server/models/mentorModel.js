const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const validator = require("validator")

const mentorSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Name field is required"]
  },
  email:{
    type:String,
    validate:[
      validator.isEmail,"Invalid Email"
    ],
    required:[true,"Email Field is Required."]
  },
  password:{
    type:String,
    required:[true,"Password field is required"],
    select:false
  },
  role:{
    type: String,
    enum: ['mentor'], 
    required: true,
  },
  availability: [{
    startTime: {
      type: Date,
      required: true,
      default: function() {
        // Default start time to 7:00 PM today
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 19, 0, 0); // 7:00 PM
      },
    },
    endTime: {
      type: Date,
      required: true,
      default: function() {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0, 0); // 9:00 PM
      },
      validate: {
        validator: function(value) {
          return value > this.startTime;
        },
        message: 'End time must be after start time.',
      },
    },
  }],
  areaOfExpertise:{
    type:Array,
    default:["Retail","Business","Consulting","Marketing","Business Analyst"]
  }
},{timestamps:true})

mentorSchema.methods.comparePasswords= async function(pass,passDB){
  return await bcrypt.compare(pass,passDB)
}

mentorSchema.pre('save', function(next) {
  if (this.availability.length === 0) {
    this.availability.push({
      startTime: new Date().setHours(19, 0, 0), // 7:00 PM
      endTime: new Date().setHours(21, 0, 0),   // 9:00 PM
    });
  }
  next();
});

mentorSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()

   this.password = await bcrypt.hash(this.password,10) 
})


const Mentors = mongoose.model("Mentors",mentorSchema)

module.exports = Mentors