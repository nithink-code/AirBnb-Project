const mongoose = require("mongoose");
const initdata = require("./data");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
 .then(()=>{
    console.log("Connected to DB");
 })
 .catch((err)=>{
    console.log(err);
 });

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=> ({...obj, owner: "6873c6c10c5a06204a284cc3"}));
    await Listing.insertMany(initdata.data);
    console.log("Data initialised");
};

initDB();

