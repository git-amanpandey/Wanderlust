const Listing = require('../models/listing.js');

module.exports.search = async (req, res) => {
    // console.log(req.query)
    let lists = await Listing.find({ location: req.query.search });
    // console.log(lists);
    if (lists.length>0) {
      req.flash("success", "This Listings exists in your search location");
      res.render("./listings/index.ejs", { lists });
    } else {
      req.flash("error", "Sorry! No listing exists in this location");
      res.redirect("/listing");
    }
  };

  module.exports.searchId = async(req,res)=>{
    // let id = req.params;
    // console.log(id);
    const lists = await Listing.find({category:req.params.id});
    // console.log(lists);
    if (lists.length > 0) {
      req.flash("success",`Available Listings of type ${req.params.id}`);
      res.render("./listings/index.ejs", { lists });
    } else {
      req.flash("error",`No ${req.params.id} Listings available till now !`);
      res.redirect("/listing");
    }
  };