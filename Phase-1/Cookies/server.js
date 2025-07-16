const express = require("express");
const app = express();
const router = express.Router();
const users = require("./user.js");
const posts = require("./post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const sessionOptions = {
       secret:"mysecretcode",
       resave:false,
       saveUninitialized:true,
};

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

// Session Route to store sessions info.
app.get("/sessiontest",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    if(name === "anonymous"){
        req.flash("error","user not registered!");
    }else{
        req.flash("success","user registered successfully!");
    }
    res.redirect("/testflash");
});

// Routes for flash

app.get("/testflash",(req,res)=>{
    res.locals.messages = req.flash("success");
    res.render("flash.ejs",{name: req.session.name});
});














app.use("/users",users);
app.use("/posts",posts);
app.use(cookieParser("secretcode"));  // To use cookie parser


// Cookies Route [these are small blocks of data the webserver stores in it.]
app.get("/sendcookie",(req,res)=>{
    res.cookie("greet","namaste");
    res.cookie("welcome","airbnb");
    res.cookie("hello","coders!");
    res.send("Cookies are Added!");
});

app.get("/test",(req,res)=>{
    console.dir(req.cookies);
    let {name="Nithin"} = req.cookies;
    res.send(`Hello, Welcome ${name}!`);
});

// Sending and Verifying signed cookies

app.get("/sendsignCookie",(req,res)=>{
    res.cookie("country","India",{signed:true});
    res.send("Signed cookie sent!");
});

//Verifying
app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("Verified Cookies!");
});


// Express Sessions Route
// Practical use case is counting no. of requests.
app.get("/testing",(req,res)=>{
    // Use of sessions for counting no. of requests.
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`You sent a request ${req.session.count} times.`);
});





// User routes
app.get("/users",(req,res)=>{
    res.send("Welcome to user Route!");
});

app.get("/users/:id",(req,res)=>{
    res.send("Welcome to id Route of User!");
});



// Post routes
app.get("/posts",(req,res)=>{
    res.send("Welcome to post Route!");
});

app.get("/posts/:id",(req,res)=>{
    res.send("Id route of posts!");
});





app.listen(8080,()=>{
    console.log("Listening to port 8080!");
});

