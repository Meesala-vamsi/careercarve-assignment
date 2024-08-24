const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = require("./app")

dotenv.config({path:"./.env"})

mongoose.connect(process.env.CONN_STRING,{
  useNewUrlParser:true
})
.then((conn)=>{
  console.log("Connected to database...")
})
.catch((err)=>{
  console.log(err)
})

const port = process.env.PORT || 3000
app.listen(port,()=>{
  console.log(`Server Started on port ` + port)
})
