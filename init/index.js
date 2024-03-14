const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>console.log("Connected With Database")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  await Listing.deleteMany({});
 let newArray = initData.data.map((obj)=>({...obj, owner:'65f062bf8e03addc4ead04ff'}));
  console.log(newArray[0]);
  await Listing.insertMany(newArray);
  console.log("data was initialized");
};

initDB();