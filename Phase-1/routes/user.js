const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const userControllers = require("../controllers/user.js");

// Signup Routes
router.route("/signup")
.get(userControllers.signUp)
.post(wrapAsync(userControllers.signUppost));

// Login Routes
router.route("/login")
.get(userControllers.login)
.post(saveredirectUrl,
     passport.authenticate('local',
        { 
          failureRedirect: '/login',
          failureFlash: true
         }),
        userControllers.loginPost);

// Logout Routes
router.get("/logout",userControllers.logout);

module.exports = router;