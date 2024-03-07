const express = require('express');
const router = express.Router({mergeParams:true});
let wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('../schema.js');
const Listing = require('../models/listing.js');
const Review = require('../models/reviews.js');


const validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
};



//Rewiews ---Post route for reviews
router.post("/",validateReview,wrapAsync(async(req,res)=>{
  console.log(req.params);
  console.log(req.body);
    let {id}=req.params;
    let list=await Listing.findById(id);
    let newRew = new Review(req.body.review);
    list.reviews.push(newRew);
  
    await newRew.save();
    await list.save();
    // console.log(list,newRew);
    res.redirect(`/listing/${id}`);
  }));
  
  //Rewiews ---Delete route for reviews
  router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId} });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
  }));

  module.exports = router;