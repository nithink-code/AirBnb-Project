const Listing = require("../models/listing.js");

// Index Route
module.exports.index = async (req,res)=>{
    const allLists = await Listing.find({});
    res.render("./listings/index.ejs",{allLists});
};

// New Route
module.exports.new = (req,res)=>{
   res.render("./listings/new.ejs");
};

// Show Route
module.exports.show = async(req,res,next)=>{
        let {id} = req.params;
        const list = await Listing.findById(id)
        .populate({
            path: "review",
            populate:{
               path: "author",   // To extract the author name with the new reviews.
            }})
            .populate("owner");
        if(!list){
            req.flash("error","Listing you requested doesnot exist!"); 
            res.redirect("/listings");
        }
        res.render("./listings/show.ejs",{list});
};

// Edit Route
module.exports.edit = async(req,res)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
         if(!listing){
            req.flash("error","Listing you requested doesnot exist!"); 
            res.redirect("/listings");
        }
        let originalUrl = listing.image.url;
        originalUrl.replace("/upload","/upload/w_300");
        res.render("./listings/edit",{listing,originalUrl});
};

// Update Route
module.exports.update = async(req,res)=>{
let {id} = req.params;
// We are deconstructing the details stored as an object into indivual detail
let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing}); 
// To edit the image
if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
}
req.flash("success","Listing Updated!");
res.redirect(`/listings/${id}`);
};

// Delete Route
module.exports.destroy = async(req,res)=>{
    let {id} = req.params;
   let deleteList = await Listing.findByIdAndDelete(id);
   console.log(deleteList);
   req.flash("success","Listing Deleted!");
   res.redirect("/listings");
};

// Error Handling Route
module.exports.error = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = {url,filename};
    await newList.save();
    req.flash("success","New Listing Added!");
    res.redirect("/listings");
  
};

