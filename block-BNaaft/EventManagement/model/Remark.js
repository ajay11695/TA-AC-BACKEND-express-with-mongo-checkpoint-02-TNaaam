
var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var remarkSchema=new Schema({
    title:{type:String,required:true},
    author:{type:String,required:true},
    likes:{type:Number,default:0},
    dislikes:{type:Number,default:0},
    eventId:{type:Schema.Types.ObjectId,required:true,ref:'Event'}

},{timestamps:true});


module.exports=mongoose.model('Remark',remarkSchema);