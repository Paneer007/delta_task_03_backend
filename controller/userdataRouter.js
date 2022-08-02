const userdataRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const User= require('../models/user')
const Comment = require('../models/comment')
const getToken = (request)=>{
    let authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer')){
        return authorization.substring(7)
    }
    else{
        return false
    }
}
userdataRouter.get('/',async(req,res)=>{
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    const person = await User.findById(decodedToken.id).populate('CommentsToMe').populate('CommentsByMe')
    return res.status(200).send(person)
})
userdataRouter.post('/newprofile',async(req,res)=>{
    const token = getToken(req)
    const data = req.body
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken=jwt.verify(token,process.env.SECRET)
    const person = await User.findByIdAndUpdate(decodedToken.id,{...data,newAccount:"Existing" })
    return res.status(200).send({message:"new profile is made"})
})
userdataRouter.post('/updateprofile',async(req,res)=>{
    const token = getToken(req)
    const data = req.body
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken=jwt.verify(token,process.env.SECRET)
    const person = await User.findByIdAndUpdate(decodedToken.id,{...data,newAccount:"Existing" })
    return res.status(200).send({message:"new profile is made"})
})
userdataRouter.get('/allusers',async(req,res)=>{
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const person = await User.find({})
    let returnObject = person.map(({Password,...rest})=>{
        return rest;
    })
    console.log(returnObject)
    returnObject = returnObject.filter(x=>!x._doc._id.equals(decodedToken.id))
    console.log(returnObject)
    return res.status(200).send(returnObject)
})
userdataRouter.get('/:userId',async(req,res)=>{
    let userId = req.params['userId'];
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token,process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    console.log(userId,decodedToken.id)
    if(decodedToken.id===userId){
        return res.status(400).redirect("../../")
    }
    const person = await User.findById(userId).populate("CommentsToMe")
    console.log(person)
    return res.status(200).send(person)
})
userdataRouter.post('/postcomment',async(req,res)=>{
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const data = req.body
    let comment = new Comment({To:data.userId, From:decodedToken.id, Describe: data.userComment.Describe, Quality: data.userComment.Quality, Day: data.userComment.Day, Thing: data.userComment.Thing})
    let id;
    await comment.save((err,com)=>{
        id = com._id
    })
    let user = await User.findById(data.userId)
    let sender = await User.findById(decodedToken.id)
    sender.CommentsByMe=[...sender.CommentsByMe,id]
    user.CommentsToMe=[...user.CommentsToMe,id]
    await user.save()
    await sender.save()
    return res.status(200).send({message:"im so done here :>"})
})
userdataRouter.delete('/comment',async(req,res)=>{
    const token = getToken(req)
    if(!token){
        return res.status(400).send({message:"enter valid credentials"})
    }
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if(!decodedToken){
        return res.status(400).send({message:"enter valid credentials"})
    }
    let commentData = req.body.data
    console.log(commentData)
    await Comment.findByIdAndDelete(commentData._id)
    return res.status(200).send({message:"peace pa"})
})

module.exports = userdataRouter