const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
let port = 8080;

main().then(()=>console.log("Connected With Database")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.engine("ejs",engine); 
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs"); // Set up ejs for templating
app.set( 'views',path.join(__dirname,"/views") ); // Point to the folder where our views are located
app.use(express.static(path.join(__dirname,"/public")));

//Normal Route
app.get("/",(req,res)=>{
  // res.send("HI!");
  res.render("./listings/new.ejs")
});

//All Listing Routes
app.use("/listing",listings);

//All Review Routes
app.use("/listing/:id/reviews",reviews);

//Middleware last
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page Not Found..!"));
});
//Error-Handling Middleware
app.use((err,req,res,next)=>{
  let {status=500,message="Something Went Wrong"} = err;
  // res.status(status).send(message);
  res.render("./listings/error.ejs",{message,status});
});

//Server Started
app.listen(port, () => console.log(`Server is running on ${port}`));