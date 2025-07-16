const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review")

const listingSchema = new Schema({
    title :{
        type : String,
        required: true,
    },
    description : String,
    image :{
        url: String,
        filename: String,
    },
    price : {
        type : Number,
        required: true,
    },
    country: {
        type : String,
        required: true,
    },
    location : {
        type : String,
        required: true,
    },
    review:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

// Mongoose Middlewares
listingSchema.post("findOneAndDelete",async(listing)=>{
     if(listing){
        await Review.deleteMany({_id:{$in: listing.review}});
     }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;