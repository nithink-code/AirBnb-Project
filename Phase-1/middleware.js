const Listing = require("../Phase-1/models/listing");
const ExpressError = require("../Phase-1/utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../Phase-1/schema.js");
const Review = require("../Phase-1/models/review.js");

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","User must be Logged in!");
        return res.redirect("/login");
     }
     next();
};

module.exports.saveredirectUrl = (req,res,next)=>{
    // To prevent the passport from reseting the redirect url from sessions.
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isUser = async(req,res,next)=>{
     let {id} = req.params;
     let listing = await Listing.findById(id);
     if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit this Listing");
        return res.redirect(`/listings/${id}`);
     }
     next();
};

// Listing Validation
module.exports.validListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        // To get the indivual details of the error we map the error.
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

// Review Validation
module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        // To get the indivual details of the error we map the error.
        let errmsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg);
    }else{
        next();
    }
};

// Authorized Review user

module.exports.isReviewAuthor = async(req,res,next)=>{
     let {id,reviewid} = req.params;
     let review = await Review.findById(reviewid);
     if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You did not create this review");
        return res.redirect(`/listings/${id}`);
     }
     next();
};


