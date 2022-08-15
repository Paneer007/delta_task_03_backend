const signupRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require("bcrypt")
signupRouter.post('/',async(req,res)=>{
    const body = req.body
    const listOfUsers = await User.find({Email:body.email})
    let result = listOfUsers.find((x)=>x.Email==body.email)
    if(result){
        return res.status(400).send({error:"Email already used"})
    }
    const saltround=10
    const passHash = await bcrypt.hash(body.password,saltround)
    const user = new User({Email:body.email, Password:passHash})
    await user.save()
    return res.status(200).send({message:"aaram se"})
})
module.exports= signupRouter