const User = require('../models/user')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const jwt = require("jsonwebtoken")
loginRouter.post('/',async(req,res)=>{
    const body = req.body
    let user = await User.find({Email:body.email})
    if(user.length==0){
        return res.status(400).send({error:"Enter a valid email"})
    }
    if(user.length>1){
        return res.status(500).send({error:"Server error, way too many users"})
    }
    user = user[0]
    const passValid = bcrypt.compare(body.password,user.Password)
    if(!passValid){
        return res.status(200).send({message:"Enter a valid password"})
    }
    const infoForUserToken={
        email:user.Email,
        id:user._id
    }
    const token = jwt.sign(infoForUserToken,process.env.SECRET)
    return res.status(200).send({token:token})
})
module.exports=loginRouter