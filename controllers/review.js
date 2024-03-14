const Listing = require("../models/listing.js");
const Review = require("../models/reviews.js");

module.exports.createReview = async (req, res) => {
  // console.log(req.params);
  // console.log(req.body);
  let { id } = req.params;
  let list = await Listing.findById(id);
  let newRew = await new Review(req.body.review);
  newRew.owner = req.user._id;
  // console.log(newRew.owner);
  list.reviews.push(newRew);
  await newRew.save();
  await list.save();
  // console.log(list,newRew);
  req.flash("success", "New Review is Created !");
  res.redirect(`/listing/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review is Deleted !");
  res.redirect(`/listing/${id}`);
};