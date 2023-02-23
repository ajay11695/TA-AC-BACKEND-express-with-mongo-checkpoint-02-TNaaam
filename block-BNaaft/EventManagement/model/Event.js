var mongoose=require('mongoose')
var Schema=mongoose.Schema

var EventSchema=new Schema({
   title:{type:String},
   summary:{type:String},
   host:{type:String},
   start_date:{type:Date},
   end_date:{type:Date},
   category:[{type:String}],
   location:{type:String},
   likes:{type:Number,default:0},
   dislikes:{type:Number,default:0},
   remarks:[{type:Schema.Types.ObjectId,ref:'Remark'}]

},{
    timestamps:true
})

module.exports=mongoose.model('Event',EventSchema)