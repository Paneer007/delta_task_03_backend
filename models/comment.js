const mongoose= require('mongoose')
const commentSchema = new mongoose.Schema({
    To:mongoose.Schema.Types.ObjectId,
    From:mongoose.Schema.Types.ObjectId,
    Describe:String,
    Quality:String,
    Day:String,
    Thing:String
})
module.exports= mongoose.model('Comment',commentSchema)