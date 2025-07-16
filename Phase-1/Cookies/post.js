const express = require("express");
const router = express.Router();

// Post routes
router.get("/posts",(req,res)=>{
    res.send("Welcome to post Route!");
});

router.get("/posts/:id",(req,res)=>{
    res.send("Id route of posts!");
});

module.exports = router;