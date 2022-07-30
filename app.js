require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const loginRouter= require('./controller/loginRouter')
const signupRouter= require('./controller/signupRouter')
const userdataRouter = require('./controller/userdataRouter')
app.use(express.json())
try{
    mongoose.connect(process.env.MONGO_URL)
    console.log('no error') 
}catch(error){
    console.log('error')
}
app.use(cors())
app.use('/api/login',loginRouter)
app.use('/api/signup',signupRouter)
app.use('/api/userdata',userdataRouter)
module.exports = app;