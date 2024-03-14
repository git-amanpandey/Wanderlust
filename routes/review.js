const express = require("express");
const router = express.Router({ mergeParams: true });
let wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");
const { isValid, IsReviewOwner, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/review");

//Create-post-Reviews
router.post("/",isValid,validateReview,wrapAsync(reviewController.createReview));

//Delete-Reviews
router.delete("/:reviewId",isValid,IsReviewOwner,wrapAsync(reviewController.deleteReview));

module.exports = router;