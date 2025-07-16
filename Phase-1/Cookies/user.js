const express = require("express");
const router = express.Router();

// User routes
router.get("/",(req,res)=>{
    res.send("Welcome to user Route!");
});

router.get("/:id",(req,res)=>{
    res.send("Welcome to id Route of User!");
});

module.exports = router;