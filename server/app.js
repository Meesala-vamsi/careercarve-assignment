const express = require("express")
const cors = require("cors")
const CustomError = require("./utils/customError")
const authRouter = require("./routes/authRoute")
const bookingRoute = require("./routes/bookingRoute")
const mentorRoute = require("./routes/mentorsRoute")
const errorController = require("./controllers/errorController")
const searchRoute = require("./routes/searchRoute")

const app = express()

app.use(express.json())
app.use(cors())

app.use("/auth",authRouter)
app.use("/",bookingRoute)
app.use("/",mentorRoute)
app.use("/",searchRoute)

app.all("*",(req,res,next)=>{
  const error = new CustomError(`The path you entered ${req.originalUrl} doesn't found on Server..`, 404)
  next(error)
})

app.use(errorController)


module.exports = app