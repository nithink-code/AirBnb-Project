if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStratergy = require("passport-local");

// Routes
const listing = require("../Phase-1/routes/listing.js");
const review = require("../Phase-1/routes/review.js");
const userRouter = require("../Phase-1/routes/user.js")

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true})); // To parse the data taken from the parameters
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

main()
 .then(()=>{
    console.log("Connected to DB");
 })
 .catch((err)=>{
    console.log(err);
 });

async function main(){
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
     mongoUrl: dbUrl,
     crypto:{
        secret: process.env.SECRET,
     },
     touchAfter: 24*3600, // When it expires after 24hrs it's in seconds.
});

store.on("error",()=>{
    console.log("Error in Mongo Session ",err);
});


// Session Object
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // To also fix a expiry date of cookies
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true  // This is used to protect from cross scripting attacks
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate())); // It is a static method for authentication.

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// To import all listing and review related routes
app.use("/listings",listing);
app.use("/listings/:id/review",review);
app.use("/",userRouter);

app.get("/",(req,res)=>{
    res.redirect("./listings");
});


// Handling wrong route access in the browser
app.all("*",(req,res,next)=>{
   next(new ExpressError(400,"Page not Found!"));
});


// Custom Error Handling Middlware 
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs",{err});
});

app.listen(3000,()=>{
    console.log("Server is listening to port 3000");
});