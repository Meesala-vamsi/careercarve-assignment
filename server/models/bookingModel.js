const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Students' },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentors' },
  duration:{
    type:Number,
    required:[true,"Duration field is required"]
  },
  startTime:{
    type:Date,
    required:[true,"StartTime is required"]
  },
  status:String,
  endTime:{
    type:Date,
    required:[true,"End date is required."]
  },
  price:Number
},{timestamps:true})

const Bookings = mongoose.model("Bookings",bookingSchema)

module.exports = Bookings