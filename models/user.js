const mongoose= require('mongoose')
const userSchema = new mongoose.Schema({
    Name:String,
    Username:String,
    RollNo:Number,
    Bio: String,
    Phone: Number,
    Email: String,
    Password:String,
    CommentsToMe:[
        {
         type:mongoose.Schema.Types.ObjectId,
         ref:'Comment'   
        }
    ],
    CommentsByMe:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'   
           }
    ],
    Image:String,
    Department:String,
    HostelName:String,
    newAccount:{
        type: String,
        enum:['New','Existing'],
        default:"New"
    },
})
module.exports=mongoose.model('User',userSchema)