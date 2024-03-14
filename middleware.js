const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const { listingSchema, reviewSchema } = require("./schema.js");

module.exports.validateSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isValid = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You are not Logged-in ! Please login ");
    res.redirect("/login");
  } else {
    next();
  }
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  const list = await Listing.findById(id);
  // console.log(list.owner);
  // console.log(req.user);
  if (!list.owner.equals(req.user._id)) {
    req.flash("error", "Sorry! You dont have permission !");
    return res.redirect(`/listing/${id}`);
  }
  next();
};

module.exports.IsReviewOwner = async (req, res, next) => {
  let { id, reviewId } = req.params;
  // console.log(reviewId);
  let rs = await Review.findById(reviewId);
  // console.log(rs.owner);
  // console.log(req.user._id);
  if (!rs.owner.equals(req.user._id)) {
    req.flash("error", "Sorry! You are not the owner !");
    return res.redirect(`/listing/${id}`);
  }
  next();
};