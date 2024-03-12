const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require('./routes/user.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');


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


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly: true,
  }
}));
// USing connect-flash for displaying msg:
app.use(flash());

//Passport-Local-Use
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.user = req.user;
  next();
});

//Normal Route
app.get("/",(req,res)=>{
  res.send("This is root !");
});

//All user route
app.use("/",userRouter);
//All Listing Routes
app.use("/listing",listingRouter);

//All Review Routes
app.use("/listing/:id/reviews",reviewRouter);

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
const port = 8080;
app.listen(port, () => console.log(`Server is running on ${port}`));