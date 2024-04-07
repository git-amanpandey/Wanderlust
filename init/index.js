const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const token = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: token });

main().then(()=>console.log("Connected With Database")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
  let data =initData.data;
  await Listing.deleteMany({});
  let x=[];
  for(let i=0;i<data.length;i++){
   let first= data[i];
  //  console.log(first.location);
   let mapCoordinate = await geocodingClient.forwardGeocode({
  query: data[i].location,
  limit: 1
})
  .send()

// console.log(mapCoordinate);
first.geometry =  mapCoordinate.body.features[0].geometry;
// console.log(first);
 x.push(first) ;

  }
  // console.log(x);
 let newArray = x.map((obj)=>({...obj, owner:'65f062bf8e03addc4ead04ff'}));
  console.log('newArray:',newArray[0]);
  await Listing.insertMany(newArray);
  console.log("data was initialized");
};

initDB();