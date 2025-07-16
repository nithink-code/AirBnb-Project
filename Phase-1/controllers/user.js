const User = require("../models/user.js");

// SignUp Route
module.exports.signUp = (req,res)=>{
      res.render("users/signup");
};

// SignUp Post Route
module.exports.signUppost = async (req,res)=>{
try{
    let {username,email,password} = req.body;
    const userone = new User({email,username});
    const registeredUser = await User.register(userone,password);
    req.login(registeredUser,(err)=>{
        if(err){
           return next(err);
        }
    console.log(registeredUser);
    req.flash("success","SignUp Successful!");
    res.redirect("/listings");   
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

// Login Route
module.exports.login = (req,res)=>{
    res.render("users/login");
};

// Login Post Route
module.exports.loginPost = async(req,res)=>{
               req.flash("success","Login Success, Welcome to Airbnb!");
               let redirectUrl = res.locals.redirectUrl || "/listings"; // To prevent it from error while directly logging in the login .
               res.redirect(redirectUrl);  // Because Passport will reset the session after login.
};

// Logout Route
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }
        req.flash("success","You Were Successfully Logged Out!");
        res.redirect("/listings");
    });
};