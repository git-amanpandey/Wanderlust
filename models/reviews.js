const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reviewSchema = new Schema({
    comment:String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    owner:{
        type:mongoose.ObjectId,
        ref:"User",
    }
});
module.exports = mongoose.model("Review",reviewSchema);