const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const Listing = require('./models/listing.js');
const engine = require('ejs-mate');
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

app.get("/",(req,res)=>{
  // res.send("HI!");
  res.render("./listings/new.ejs")
});

// Index Route
app.get("/listing",  async(req,res)=>{
  const lists= await Listing.find({});
  res.render("./listings/index.ejs",{lists});
});

//New Route --->Create Route
app.get("/listing/new", (req,res)=>{
  res.render("./listings/form.ejs");
});

app.post("/listing/create",async(req,res)=>{
    console.log(req.body.list);
  const newList =new Listing(req.body.list);
  await newList.save();
  res.redirect("/listing");
});
// Show Route
app.get("/listing/:id",async(req,res)=>{
  let {id} = req.params;
  const list= await Listing.findById(id);
  // res.send("ok....!");
  res.render("./listings/show.ejs",{list});
});

// Update Route
app.get("/listing/:id/edit",async(req,res)=>{
  let {id} = req.params;
 const list= await Listing.findById(id);
  res.render("./listings/edit.ejs",{list});
})

app.put("/listing/:id",async(req,res)=>{
  let {id} = req.params;
  // console.log(id);
  // console.log(req.body);
  // console.log(req.body.list);
   await Listing.findByIdAndUpdate(id,{...req.body.list},{new:true}); 
   res.redirect(`/listing/${id}`);
});

//Destroy Route
app.delete("/listing/:id",async(req,res)=>{
  let {id} =req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listing");
});

app.listen(port, () => console.log(`Server is running on ${port}`));
