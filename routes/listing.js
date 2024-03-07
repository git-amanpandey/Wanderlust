const express = require('express');
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema,reviewSchema} = require('../schema.js');


const validateSchema=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el)=>el.message).join(",")
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
};



router.get("/",  wrapAsync( async(req,res,next)=>{
    const lists= await Listing.find({});
    res.render("./listings/index.ejs",{lists});
  }));
  
  //New Route --->Create Route
  
  router.get("/new", (req,res)=>{
    res.render("./listings/form.ejs");
  });
  
  
  router.post("/create",validateSchema,wrapAsync(async(req,res)=>{
      console.log(req.body.list);
    const newList =new Listing(req.body.list);
    await newList.save();
    res.redirect("/listing");
  }));
  // Show Route
  
  router.get("/:id", wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const list= await Listing.findById(id).populate("reviews");
    // res.send("ok....!");
    res.render("./listings/show.ejs",{list});
  }));
  
  // Update Route
  
  router.get("/:id/edit",wrapAsync(async(req,res)=>{
    let {id} = req.params;
   const list= await Listing.findById(id);
    res.render("./listings/edit.ejs",{list});
  }));
  
  
  router.put("/:id",validateSchema,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    // console.log(id);
    // console.log(req.body);
    // console.log(req.body.list);
    if(!req.body.list){
      throw new ExpressError(400,"Send valid data for listing");
    }
     await Listing.findByIdAndUpdate(id,{...req.body.list},{new:true}); 
     res.redirect(`/listing/${id}`);
  }));
  
  //Destroy Route
  router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} =req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
  }));


  module.exports = router;