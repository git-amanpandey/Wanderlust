const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./reviews.js");
const wrapAsync = require("../utils/wrapAsync.js");

const listingSchema = new Schema({
  title: {
    type:String,
    required: true
  },
  description: String,
  image: {
    // type:Object,
    filename:{type:String},
    url:{
      type:String,
      default:"https://images.unsplash.com/photo-1533167649158-6d508895b680?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c3BsYXNofGVufDB8fDB8fHww" ,
      set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
    }},
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
    type:mongoose.ObjectId,
    ref:"Review",
    },
],
owner:{
    type:mongoose.ObjectId,
    ref:"User",
}
});

listingSchema.post("findOneAndDelete",wrapAsync(async(list)=>{
  console.log(list);
  if(list){
  let x = await Review.deleteMany({_id: {$in: list.reviews}});
   console.log(x);
  }
}));

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;