const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const router = express.Router({mergeParams:true}); // mergeParams is used to allow the parent [id] route to merge in child routes.
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const reviewControllers = require("../controllers/review.js");

// Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewControllers.reviewRoute));

// Delete Review
router.delete("/:reviewid", isLoggedIn, isReviewAuthor, wrapAsync(reviewControllers.destroy));

module.exports = router;