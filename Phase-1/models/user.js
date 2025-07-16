const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    // passport-local-mongoose will automatically create  the username and password we don't have to mention it in schema.
     email:{
        type: String,
        required: true
     },
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);