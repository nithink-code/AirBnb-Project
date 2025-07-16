const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const router = express.Router();
const {isLoggedIn, isUser} = require("../middleware.js");
const {validListing} = require("../middleware.js");
const listingControllers = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

// Using Router.route to combine the common path routes.
router.route("/")
  .get(wrapAsync(listingControllers.index))
  .post(upload.single("listing[image]"),validListing,  wrapAsync(listingControllers.error));

// New Route [Place it above the show route else it will consider /listings/new as [/new] as id]
router.get("/new",isLoggedIn,listingControllers.new);

router.route("/:id")
.get(wrapAsync(listingControllers.show))
.put(upload.single("listing[image]"),validListing,isLoggedIn, isUser,wrapAsync(listingControllers.update))
.delete(isLoggedIn,isUser, wrapAsync(listingControllers.destroy));

// Edit Route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingControllers.edit));

module.exports = router;