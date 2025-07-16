const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Review Route
module.exports.reviewRoute = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New Review Added!");
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${listing._id}`)
};

// Delete Review
module.exports.destroy = async(req,res)=>{
    let {id,reviewid} = req.params;
    // Update the listing schema after deleting the review
       await Listing.findByIdAndUpdate(id,{$pull: {review: reviewid}})
       await Review.findByIdAndDelete(reviewid);
       req.flash("success","Review Deleted!");
       res.redirect(`/listings/${id}`);
};